# backend/app/resources/auth.py

from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask import jsonify

def role_required(*roles):
    """
    Decorador para restringir acceso por rol (claims['role']).
    Ejemplo: @role_required('manager')
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # Se asegura de que haya un JWT válido
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get('role') not in roles:
                return jsonify(msg='Permiso denegado'), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
