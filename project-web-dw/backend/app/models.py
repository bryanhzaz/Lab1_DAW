## backend/app/models.py
from . import db

class DimProducto(db.Model):
    __tablename__ = 'dim_producto'
    producto_key = db.Column(db.Integer, primary_key=True)
    producto     = db.Column(db.String(100), unique=True, nullable=False)

class DimAlmacen(db.Model):
    __tablename__ = 'dim_almacen'
    almacen_key  = db.Column(db.Integer, primary_key=True)
    almacen      = db.Column(db.String(100), unique=True, nullable=False)

class DimTiempo(db.Model):
    __tablename__ = 'dim_tiempo'
    tiempo_key  = db.Column(db.Integer, primary_key=True)
    fecha       = db.Column(db.Date,   unique=True, nullable=False)
    anio        = db.Column(db.Integer, nullable=False)
    mes         = db.Column(db.Integer, nullable=False)
    dia         = db.Column(db.Integer, nullable=False)
    trimestre   = db.Column(db.Integer, nullable=False)

class DimCliente(db.Model):
    __tablename__ = 'dim_cliente'
    cliente_key = db.Column(db.Integer, primary_key=True)
    cliente     = db.Column(db.String(100), unique=True)

class DimModoTransporte(db.Model):
    __tablename__ = 'dim_modo_transporte'
    modo_key          = db.Column(db.Integer, primary_key=True)
    modo_transporte   = db.Column(db.String(100), unique=True, nullable=False)

class DimDestino(db.Model):
    __tablename__ = 'dim_destino'
    destino_key = db.Column(db.Integer, primary_key=True)
    destino     = db.Column(db.String(100), unique=True, nullable=False)

class FactInventario(db.Model):
    __tablename__ = 'fact_inventario'
    inventario_key   = db.Column(db.Integer, primary_key=True)
    id_inventario    = db.Column(db.String(36), unique=True, nullable=False)
    producto_key     = db.Column(db.Integer, db.ForeignKey('dim_producto.producto_key'), nullable=False)
    almacen_key      = db.Column(db.Integer, db.ForeignKey('dim_almacen.almacen_key'), nullable=False)
    tiempo_key       = db.Column(db.Integer, db.ForeignKey('dim_tiempo.tiempo_key'), nullable=False)
    stock_actual     = db.Column(db.Integer, nullable=False)
    estado_producto  = db.Column(db.String(50))

class FactTransporte(db.Model):
    __tablename__ = 'fact_transporte'
    transporte_key      = db.Column(db.Integer, primary_key=True)
    id_envio            = db.Column(db.String(36), unique=True, nullable=False)
    origen              = db.Column(db.String(100), nullable=False)
    destino_key         = db.Column(db.Integer, db.ForeignKey('dim_destino.destino_key'), nullable=False)
    modo_key            = db.Column(db.Integer, db.ForeignKey('dim_modo_transporte.modo_key'), nullable=False)
    tiempo_salida_key   = db.Column(db.Integer, db.ForeignKey('dim_tiempo.tiempo_key'), nullable=False)
    tiempo_llegada_key  = db.Column(db.Integer, db.ForeignKey('dim_tiempo.tiempo_key'), nullable=False)
    temperatura_promedio= db.Column(db.Float)
    gps                 = db.Column(db.String(50))
    costo_flete         = db.Column(db.Float)

class FactOrden(db.Model):
    __tablename__ = 'fact_orden'
    orden_key        = db.Column(db.Integer, primary_key=True)
    id_orden         = db.Column(db.String(36), unique=True, nullable=False)
    cliente_key      = db.Column(db.Integer, db.ForeignKey('dim_cliente.cliente_key'), nullable=False)
    producto_key     = db.Column(db.Integer, db.ForeignKey('dim_producto.producto_key'), nullable=False)
    tiempo_key       = db.Column(db.Integer, db.ForeignKey('dim_tiempo.tiempo_key'), nullable=False)
    cantidad         = db.Column(db.Float)
    precio_unitario  = db.Column(db.Float)
    estado_pago      = db.Column(db.String(50))
    destino_key      = db.Column(db.Integer, db.ForeignKey('dim_destino.destino_key'), nullable=False)

# Puedes conservar FactVenta si lo usas en tu UI
class FactVenta(db.Model):
    __tablename__ = 'fact_venta'
    id         = db.Column(db.Integer, primary_key=True)
    producto   = db.Column(db.String(100))
    categoria  = db.Column(db.String(50))
    monto      = db.Column(db.Float)
    fecha      = db.Column(db.Date)
