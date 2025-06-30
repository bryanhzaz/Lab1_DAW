#backend/app/resources/user.py
from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token

USERS = {'analista': 'pass123', 'gerente': 'gerente!'}
ROLES = {'analista': 'analyst', 'gerente': 'manager'}

class UserLogin(Resource):
    def post(self):
        u = request.json.get('username')
        p = request.json.get('password')
        if USERS.get(u) == p:
            # Identity debe ser string; rol va en additional_claims
            token = create_access_token(
                identity=u,
                additional_claims={'role': ROLES[u]}
            )
            return {'access_token': token}, 200
        return {'msg': 'Credenciales inválidas'}, 401
