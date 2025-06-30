## backend/app/__init__.py
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_caching   import Cache
from flask_cors      import CORS

db    = SQLAlchemy()
jwt   = JWTManager()
cache = Cache(config={'CACHE_TYPE': 'RedisCache', 'CACHE_REDIS_URL': 'redis://redis:6379/0'})

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object('config.Config')

    db.init_app(app)
    jwt.init_app(app)
    cache.init_app(app)

    
    from .resources.user    import UserLogin
    from .resources.data    import DataResource
    from .resources.metrics import MetricsResource
    from .resources.orden   import OrdenResource
    from .resources.analytics import (
        StatsVentasResource, HistogramaPrecioResource, ScatterPrecioCantidadResource
    )

    app.add_url_rule('/login',     view_func=UserLogin.as_view('login'))
    app.add_url_rule('/data',      view_func=DataResource.as_view('data'))
    app.add_url_rule('/metrics',   view_func=MetricsResource.as_view('metrics'))
    app.add_url_rule('/dw/ordenes',view_func=OrdenResource.as_view('dw_ordenes'))
    app.add_url_rule('/stats/ventas', view_func=StatsVentasResource.as_view('stats_ventas'))
    app.add_url_rule('/histogram/precio_unitario', view_func=HistogramaPrecioResource.as_view('hist_precio_unitario'))
    app.add_url_rule('/scatter/precio_vs_cantidad', view_func=ScatterPrecioCantidadResource.as_view('scatter_precio_cantidad'))

    return app
