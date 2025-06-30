# backend/app/resources/analytics.py

from flask_restful import Resource
from flask_jwt_extended import jwt_required
from .. import db
from ..models import FactOrden, DimProducto
from sqlalchemy import func
import numpy as np

class StatsVentasResource(Resource):
    @jwt_required()
    def get(self):
        # Estadísticos descriptivos para precio_unitario, cantidad, total_venta
        rows = db.session.query(FactOrden.precio_unitario, FactOrden.cantidad).all()
        precios = [float(r[0]) for r in rows]
        cantidades = [float(r[1]) for r in rows]
        totales = [float(r[0])*float(r[1]) for r in rows]
        stats = {
            'precio_unitario': {
                'mean': float(np.mean(precios)),
                'median': float(np.median(precios)),
                'min': float(np.min(precios)),
                'max': float(np.max(precios)),
                'std': float(np.std(precios))
            },
            'cantidad': {
                'mean': float(np.mean(cantidades)),
                'median': float(np.median(cantidades)),
                'min': float(np.min(cantidades)),
                'max': float(np.max(cantidades)),
                'std': float(np.std(cantidades))
            },
            'total_venta': {
                'mean': float(np.mean(totales)),
                'median': float(np.median(totales)),
                'min': float(np.min(totales)),
                'max': float(np.max(totales)),
                'std': float(np.std(totales))
            }
        }
        return stats, 200

class HistogramaPrecioResource(Resource):
    @jwt_required()
    def get(self):
        rows = db.session.query(FactOrden.precio_unitario).all()
        precios = [float(r[0]) for r in rows]
        hist, bin_edges = np.histogram(precios, bins=10)
        bins = []
        for i in range(len(hist)):
            bins.append({'range': f'{int(bin_edges[i])}-{int(bin_edges[i+1])}', 'count': int(hist[i])})
        return bins, 200

class ScatterPrecioCantidadResource(Resource):
    @jwt_required()
    def get(self):
        rows = db.session.query(FactOrden.precio_unitario, FactOrden.cantidad).all()
        puntos = [
            {'precio': float(p), 'cantidad': float(c)}
            for p, c in rows
        ]
        return puntos, 200
