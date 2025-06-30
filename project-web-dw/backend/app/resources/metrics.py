# backend/app/resources/metrics.py

from flask_restful import Resource
from .. import db
from ..models import FactOrden, DimProducto
from sqlalchemy import func

class MetricsResource(Resource):
    def get(self):
        """
        Retorna la suma total de ventas (cantidad * precio_unitario) agrupado por producto,
        de la tabla fact_orden / dim_producto.
        """
        stmt = (
            db.session.query(
                DimProducto.producto.label('categoria'),
                func.sum(FactOrden.cantidad * FactOrden.precio_unitario).label('total')
            )
            .join(DimProducto, FactOrden.producto_key == DimProducto.producto_key)
            .group_by(DimProducto.producto)
        )
        data = [{'categoria': prod, 'total': float(total)} for prod, total in stmt]
        return data, 200
