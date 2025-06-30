# backend/app/resources/data.py

from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from .. import db
from ..models import FactOrden, DimCliente, DimProducto, DimTiempo

class DataResource(Resource):
    @jwt_required()
    def get(self):
        """
        GET /data?from=YYYY-MM-DD&to=YYYY-MM-DD
        Devuelve las órdenes consolidadas con sus dimensiones.
        """
        # Leer filtros de querystring
        fecha_from = request.args.get('from')
        fecha_to   = request.args.get('to')

        # Construir la consulta base uniendo hechos con dimensiones
        stmt = (
            db.session.query(
                FactOrden.orden_key,
                DimCliente.cliente,
                DimProducto.producto,
                DimTiempo.fecha,
                FactOrden.cantidad,
                FactOrden.precio_unitario
            )
            .join(DimCliente,  FactOrden.cliente_key  == DimCliente.cliente_key)
            .join(DimProducto, FactOrden.producto_key == DimProducto.producto_key)
            .join(DimTiempo,   FactOrden.tiempo_key   == DimTiempo.tiempo_key)
        )

        # Aplicar filtros de fecha si vienen en la petición
        if fecha_from:
            stmt = stmt.filter(DimTiempo.fecha >= fecha_from)
        if fecha_to:
            stmt = stmt.filter(DimTiempo.fecha <= fecha_to)

        # Ejecutar y formatear el resultado
        rows = stmt.all()
        result = []
        for orden_key, cliente, producto, fecha, cantidad, precio_unitario in rows:
            result.append({
                "orden_key":       orden_key,
                "cliente":         cliente,
                "producto":        producto,
                "fecha":           fecha.isoformat(),
                "cantidad":        cantidad,
                "precio_unitario": precio_unitario
            })

        return result, 200
