import json
import os
import hashlib
import secrets
import psycopg2


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def handler(event: dict, context) -> dict:
    '''Авторизация: регистрация по телефону+паролю, вход и получение профиля по токену.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    conn = get_conn()
    conn.autocommit = True
    cur = conn.cursor()

    try:
        params = event.get('queryStringParameters') or {}
        action = params.get('action', '')

        # GET профиль по токену
        if method == 'GET':
            token = (event.get('headers') or {}).get('X-Auth-Token') or (event.get('headers') or {}).get('x-auth-token')
            if not token:
                return {'statusCode': 401, 'headers': cors_headers(), 'body': json.dumps({'error': 'no token'})}
            cur.execute(
                "SELECT u.id, u.phone, u.full_name, u.email, u.card_number, u.role "
                "FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = %s",
                (token,)
            )
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': cors_headers(), 'body': json.dumps({'error': 'invalid token'})}
            user = {'id': row[0], 'phone': row[1], 'full_name': row[2], 'email': row[3], 'card_number': row[4], 'role': row[5]}
            return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'user': user})}

        body = json.loads(event.get('body') or '{}')

        if method == 'PUT':
            token = (event.get('headers') or {}).get('X-Auth-Token') or (event.get('headers') or {}).get('x-auth-token')
            cur.execute("SELECT user_id FROM sessions WHERE token = %s", (token,))
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': cors_headers(), 'body': json.dumps({'error': 'invalid token'})}
            uid = row[0]
            full_name = (body.get('full_name') or '').strip()
            email = (body.get('email') or '').strip()
            card_number = (body.get('card_number') or '').strip()
            cur.execute(
                "UPDATE users SET full_name = %s, email = %s, card_number = %s WHERE id = %s",
                (full_name, email, card_number, uid)
            )
            cur.execute("SELECT id, phone, full_name, email, card_number, role FROM users WHERE id = %s", (uid,))
            r = cur.fetchone()
            user = {'id': r[0], 'phone': r[1], 'full_name': r[2], 'email': r[3], 'card_number': r[4], 'role': r[5]}
            return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'user': user})}

        phone = (body.get('phone') or '').strip()
        password = body.get('password') or ''

        if not phone or not password:
            return {'statusCode': 400, 'headers': cors_headers(), 'body': json.dumps({'error': 'phone and password required'})}

        if action == 'register':
            cur.execute("SELECT id FROM users WHERE phone = %s", (phone,))
            if cur.fetchone():
                return {'statusCode': 409, 'headers': cors_headers(), 'body': json.dumps({'error': 'Пользователь с таким телефоном уже существует'})}
            full_name = (body.get('full_name') or '').strip()
            cur.execute(
                "INSERT INTO users (phone, password_hash, full_name, role) VALUES (%s, %s, %s, 'client') RETURNING id, role",
                (phone, hash_password(password), full_name)
            )
            uid, role = cur.fetchone()
            token = secrets.token_hex(32)
            cur.execute("INSERT INTO sessions (token, user_id) VALUES (%s, %s)", (token, uid))
            user = {'id': uid, 'phone': phone, 'full_name': full_name, 'email': '', 'card_number': '', 'role': role}
            return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'token': token, 'user': user})}

        if action == 'login':
            cur.execute(
                "SELECT id, password_hash, full_name, email, card_number, role FROM users WHERE phone = %s",
                (phone,)
            )
            row = cur.fetchone()
            if not row or row[1] != hash_password(password):
                return {'statusCode': 401, 'headers': cors_headers(), 'body': json.dumps({'error': 'Неверный телефон или пароль'})}
            uid = row[0]
            token = secrets.token_hex(32)
            cur.execute("INSERT INTO sessions (token, user_id) VALUES (%s, %s)", (token, uid))
            user = {'id': uid, 'phone': phone, 'full_name': row[2], 'email': row[3], 'card_number': row[4], 'role': row[5]}
            return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'token': token, 'user': user})}

        return {'statusCode': 400, 'headers': cors_headers(), 'body': json.dumps({'error': 'unknown action'})}
    finally:
        cur.close()
        conn.close()