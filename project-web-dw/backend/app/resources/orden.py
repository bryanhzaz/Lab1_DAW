# backend/app/resources/orden.py
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from .. import db
from ..models import FactOrden, DimCliente, DimProducto, DimTiempo

class OrdenResource(Resource):
    @jwt_required()
    def get(self):
        stmt = (
            db.session.query(
                FactOrden.orden_key,
                DimCliente.cliente,
                DimProducto.producto,
                DimTiempo.fecha,
                FactOrden.cantidad,
                FactOrden.precio_unitario
            )
            .join(DimCliente,  FactOrden.cliente_key == DimCliente.cliente_key)
            .join(DimProducto, FactOrden.producto_key == DimProducto.producto_key)
            .join(DimTiempo,   FactOrden.tiempo_key == DimTiempo.tiempo_key)
        )
        rows = stmt.all()
        return [
            {
                "orden_key":       o,
                "cliente":         c,
                "producto":        p,
                "fecha":           f.isoformat(),
                "cantidad":        cant,
                "precio_unitario": pu
            }
            for o,c,p,f,cant,pu in rows
        ], 200
