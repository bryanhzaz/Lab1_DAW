# backend/etl_dw.py

import os
from sqlalchemy import create_engine, text
import pandas as pd

DATABASE_URI = os.getenv(
    'DATABASE_URI',
    'postgresql://user:secret@db:5432/dw'
)
engine = create_engine(DATABASE_URI, future=True)

def create_schema(conn):
    # Solo si la tabla dim_producto NO existe, cargo TODO el DDL
    exists = conn.execute(text(
        "SELECT to_regclass('public.dim_producto')"
    )).scalar()
    if not exists:
        ddl = open(
            os.path.join(os.path.dirname(__file__), 'create_dw_schema.sql')
        ).read()
        conn.execute(text(ddl))
        print("▶ Schema creado")
    else:
        print("▶ Schema ya existe, se omite DDL")

def upsert_dim(conn, table, key_col, val_col, values):
    uniques = pd.Series(values).dropna().unique()
    for v in uniques:
        conn.execute(text(f"""
            INSERT INTO {table} ({val_col})
            SELECT :v WHERE NOT EXISTS (
              SELECT 1 FROM {table} WHERE {val_col} = :v
            )
        """), {"v": v})
    rows = conn.execute(text(
        f"SELECT {key_col}, {val_col} FROM {table}"
    )).all()
    return { row[1]: row[0] for row in rows }

def upsert_tiempo(conn, dates):
    uniques = pd.Series(dates).dropna().dt.date.unique()
    for d in uniques:
        conn.execute(text("""
            INSERT INTO dim_tiempo (fecha, anio, mes, dia, trimestre)
            SELECT :d::date
                 , EXTRACT(YEAR   FROM :d::date)
                 , EXTRACT(MONTH  FROM :d::date)
                 , EXTRACT(DAY    FROM :d::date)
                 , CEIL(EXTRACT(MONTH FROM :d::date)/3.0)
            WHERE NOT EXISTS (
              SELECT 1 FROM dim_tiempo WHERE fecha = :d::date
            )
        """), {"d": d})
    rows = conn.execute(text(
        "SELECT tiempo_key, fecha FROM dim_tiempo"
    )).all()
    return { row[1]: row[0] for row in rows }

def main():
    base = os.path.dirname(__file__)
    df1 = pd.read_csv(os.path.join(base, "datos_inventario_limpio.csv"),
                      parse_dates=["fecha_reabastecimiento"])
    df2 = pd.read_csv(os.path.join(base, "eventos_transporte_limpio.csv"),
                      parse_dates=["fecha_salida","fecha_llegada"])
    df3 = pd.read_csv(os.path.join(base, "ordenes_compra_limpio.csv"),
                      parse_dates=["fecha"])

    with engine.begin() as conn:
        create_schema(conn)

        prod_map = upsert_dim(conn, "dim_producto","producto_key","producto",
                              pd.concat([df1["producto"],df3["producto"]],ignore_index=True))
        alm_map  = upsert_dim(conn, "dim_almacen","almacen_key","almacen", df1["almacen"])
        cli_map  = upsert_dim(conn, "dim_cliente","cliente_key","cliente", df3["cliente"])
        modo_map = upsert_dim(conn,"dim_modo_transporte","modo_key","modo_transporte", df2["modo_transporte"])
        dest_map = upsert_dim(conn,"dim_destino","destino_key","destino", df2["destino"])
        time_map = upsert_tiempo(conn, pd.concat([
            df1["fecha_reabastecimiento"], df2["fecha_salida"],
            df2["fecha_llegada"], df3["fecha"]
        ],ignore_index=True))

        conn.execute(text("TRUNCATE fact_inventario, fact_transporte, fact_orden"))

        for _, r in df1.iterrows():
            conn.execute(text("""
                INSERT INTO fact_inventario
                  (id_inventario, producto_key, almacen_key, tiempo_key
                  ,stock_actual, estado_producto)
                VALUES
                  (:id_inv, :p, :a, :t, :stock, :estado)
            """),{"id_inv":r["id_inventario"],"p":prod_map[r["producto"]],
                  "a":alm_map[r["almacen"]],
                  "t":time_map[r["fecha_reabastecimiento"].date()],
                  "stock":int(r["stock_actual"]),"estado":r["estado_producto"]})
        for _, r in df2.iterrows():
            conn.execute(text("""
                INSERT INTO fact_transporte
                  (id_envio, origen, destino_key, modo_key
                  ,tiempo_salida_key, tiempo_llegada_key
                  ,temperatura_promedio, gps, costo_flete)
                VALUES
                  (:id_env, :orig, :dest, :mod
                  ,:ts, :tl, :temp, :gps, :costo)
            """),{"id_env":r["id_envio"],"orig":r["origen"],
                  "dest":dest_map[r["destino"]],
                  "mod":modo_map[r["modo_transporte"]],
                  "ts":r["fecha_salida"].date(),
                  "tl":r["fecha_llegada"].date(),
                  "temp":float(r["temperatura_promedio"]),
                  "gps":r["gps"],"costo":int(r["costo_flete"])})
        for _, r in df3.iterrows():
            conn.execute(text("""
                INSERT INTO fact_orden
                  (id_orden, cliente_key, producto_key, tiempo_key
                  ,cantidad, precio_unitario, estado_pago, destino_key)
                VALUES
                  (:id_o, :cli, :prod, :t
                  ,:cant, :precio, :est, :dest)
            """),{"id_o":r["id_orden"],"cli":cli_map[r["cliente"]],
                  "prod":prod_map[r["producto"]],
                  "t":time_map[r["fecha"].date()],
                  "cant":float(r["cantidad"]),
                  "precio":int(r["precio_unitario"]),
                  "est":r["estado_pago"],
                  "dest":dest_map[r["destino"]]})
    print("▶ ETL completado: dimensiones y hechos cargados.")

if __name__=="__main__":
    main()
