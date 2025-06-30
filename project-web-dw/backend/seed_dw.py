"""
Genera datos ficticios para TODAS las dimensiones y hechos de tu
Data Warehouse y los inserta en PostgreSQL.

Ejecución (dentro del contenedor backend):
$ python seed_dw.py
"""

import random
from datetime import date, timedelta
from faker import Faker

from app import create_app, db
from app.models import (
    DimProducto, DimAlmacen, DimTiempo, DimCliente,
    DimModoTransporte, DimDestino,
    FactInventario, FactTransporte, FactOrden
)

fake = Faker("es_MX")
app  = create_app()

# ---------- utilidades -----------------------------------------------

def bulk_insert(model, values, unique_field):
    """
    Inserta en masa valores únicos y devuelve un dict {valor: pk}
    """
    existing = {getattr(r, unique_field): r
                for r in model.query.all()}

    for v in values:
        if v not in existing:
            obj = model(**{unique_field: v})
            db.session.add(obj)
            existing[v] = obj
    db.session.commit()
    # mapea valor → clave primaria
    pk_name = list(model.__mapper__.primary_key)[0].name
    return {v: getattr(o, pk_name) for v, o in existing.items()}

def bulk_insert_fechas(fechas):
    """
    Asegura que cada fecha exista en DimTiempo y devuelve {fecha: tiempo_key}
    """
    existing = {d.fecha: d for d in DimTiempo.query.all()}

    for f in fechas:
        if f not in existing:
            dt = DimTiempo(
                fecha     = f,
                anio      = f.year,
                mes       = f.month,
                dia       = f.day,
                trimestre = (f.month - 1)//3 + 1
            )
            db.session.add(dt)
            existing[f] = dt
    db.session.commit()
    return {f: t.tiempo_key for f, t in existing.items()}

# ---------- generación de datos --------------------------------------

def generate_dimensiones():
    productos = [fake.unique.word().capitalize() for _ in range(50)]
    almacenes = [fake.unique.city()            for _ in range(10)]
    clientes  = [fake.unique.company()         for _ in range(40)]
    modos     = ["Aéreo", "Marítimo", "Terrestre", "Ferroviario"]
    destinos  = [fake.unique.city()            for _ in range(30)]

    prod_map  = bulk_insert(DimProducto,       productos, "producto")
    alm_map   = bulk_insert(DimAlmacen,        almacenes, "almacen")
    cli_map   = bulk_insert(DimCliente,        clientes,  "cliente")
    modo_map  = bulk_insert(DimModoTransporte, modos,     "modo_transporte")
    dest_map  = bulk_insert(DimDestino,        destinos,  "destino")

    # 365 fechas aleatorias dentro del año pasado
    fechas = [
        date.today() - timedelta(days=random.randint(0, 365))
        for _ in range(365)
    ]
    time_map = bulk_insert_fechas(fechas)

    return prod_map, alm_map, cli_map, modo_map, dest_map, time_map

def generate_hechos(prod, alm, cli, modo, dest, tiempo):
    """
    Genera ~5 000 filas en los tres hechos
    """
    # Limpia primero
    FactInventario.query.delete()
    FactTransporte.query.delete()
    FactOrden.query.delete()

    # ---- inventario
    for _ in range(1500):
        db.session.add(FactInventario(
            id_inventario    = fake.unique.uuid4(),
            producto_key     = random.choice(list(prod.values())),
            almacen_key      = random.choice(list(alm.values())),
            tiempo_key       = random.choice(list(tiempo.values())),
            stock_actual     = random.randint(0, 2000),
            estado_producto  = random.choice(["En stock", "Dañado", "En tránsito"])
        ))

    # ---- transporte
    for _ in range(1500):
        salida_date, salida_key = random.choice(list(tiempo.items()))
        llegada_date = salida_date + timedelta(days=random.randint(1, 20))
        llegada_key = tiempo.get(llegada_date) or \
            bulk_insert_fechas([llegada_date])[llegada_date]

        db.session.add(FactTransporte(
            id_envio             = fake.unique.uuid4(),
            origen               = fake.city(),
            destino_key          = random.choice(list(dest.values())),
            modo_key             = random.choice(list(modo.values())),
            tiempo_salida_key    = salida_key,
            tiempo_llegada_key   = llegada_key,
            temperatura_promedio = round(random.uniform(-5, 30), 1),
            gps                  = f"{fake.latitude()},{fake.longitude()}",
            costo_flete          = random.randint(5000, 200000)
        ))

    # ---- órdenes
    for _ in range(2000):
        fecha_key = random.choice(list(tiempo.values()))
        db.session.add(FactOrden(
            id_orden        = fake.unique.uuid4(),
            cliente_key     = random.choice(list(cli.values())),
            producto_key    = random.choice(list(prod.values())),
            tiempo_key      = fecha_key,
            cantidad        = round(random.uniform(1, 100), 2),
            precio_unitario = random.randint(100, 15000),
            estado_pago     = random.choice(["Pagado", "Pendiente", "Reembolsado"]),
            destino_key     = random.choice(list(dest.values()))
        ))

    db.session.commit()

def main():
    with app.app_context():
        prod, alm, cli, modo, dest, tiempo = generate_dimensiones()
        generate_hechos(prod, alm, cli, modo, dest, tiempo)
        print("DW ficticio sembrado ✔")

if __name__ == "__main__":
    main()
