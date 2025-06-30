# backend/seed_data.py
from datetime import date
from app import create_app, db
from app.models import FactVenta

def seed():
    app = create_app()
    with app.app_context():
        # Borra registros previos (opcional)
        FactVenta.query.delete()

        muestras = [
            {"producto": "TV 4K",     "categoria": "Electrónica", "monto": 12000.50, "fecha": date(2025, 1, 15)},
            {"producto": "Laptop",    "categoria": "Electrónica", "monto": 25000.00, "fecha": date(2025, 2, 10)},
            {"producto": "Escritorio","categoria": "Muebles",     "monto":  4500.75, "fecha": date(2025, 3, 5)},
            {"producto": "Silla",     "categoria": "Muebles",     "monto":  1200.00, "fecha": date(2025, 4, 22)},
            {"producto": "Smartphone","categoria": "Electrónica", "monto":  9800.00, "fecha": date(2025, 5, 3)},
        ]

        for m in muestras:
            venta = FactVenta(**m)
            db.session.add(venta)
        db.session.commit()
        print(f"Sembradas {len(muestras)} ventas de ejemplo.")

if __name__ == "__main__":
    seed()
