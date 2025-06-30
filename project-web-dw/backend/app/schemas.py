#backend/app/schemas.py
from marshmallow import Schema, fields

class VentaSchema(Schema):
    producto = fields.Str()
    categoria = fields.Str()
    monto = fields.Float()
    fecha = fields.Date()