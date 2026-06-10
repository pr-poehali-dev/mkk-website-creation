import json
import os
import psycopg2


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


def get_user(cur, token):
    if not token:
        return None
    cur.execute("SELECT u.id, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = %s", (token,))
    row = cur.fetchone()
    return {'id': row[0], 'role': row[1]} if row else None


def loan_to_dict(row):
    return {
        'id': row[0], 'user_id': row[1], 'amount': row[2], 'days': row[3],
        'total_payment': row[4], 'due_date': row[5].isoformat() if row[5] else None,
        'status': row[6], 'created_at': row[7].isoformat() if row[7] else None,
        'full_name': row[8] if len(row) > 8 else None,
        'phone': row[9] if len(row) > 9 else None,
    }


def handler(event: dict, context) -> dict:
    '''Заявки на займ: создание клиентом, список своих заявок, список всех и смена статуса для админа.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    conn = get_conn()
    conn.autocommit = True
    cur = conn.cursor()
    try:
        headers = event.get('headers') or {}
        token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
        user = get_user(cur, token)
        if not user:
            return {'statusCode': 401, 'headers': cors_headers(), 'body': json.dumps({'error': 'unauthorized'})}

        params = event.get('queryStringParameters') or {}

        # GET список заявок
        if method == 'GET':
            scope = params.get('scope', 'mine')
            if scope == 'all' and user['role'] == 'admin':
                cur.execute(
                    "SELECT l.id, l.user_id, l.amount, l.days, l.total_payment, l.due_date, l.status, l.created_at, "
                    "u.full_name, u.phone FROM loan_applications l JOIN users u ON u.id = l.user_id "
                    "ORDER BY l.created_at DESC"
                )
                loans = [loan_to_dict(r) for r in cur.fetchall()]
                cur.execute("SELECT status, COUNT(*), COALESCE(SUM(amount),0) FROM loan_applications GROUP BY status")
                stats = {row[0]: {'count': row[1], 'sum': int(row[2])} for row in cur.fetchall()}
                return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'loans': loans, 'stats': stats})}
            else:
                cur.execute(
                    "SELECT id, user_id, amount, days, total_payment, due_date, status, created_at "
                    "FROM loan_applications WHERE user_id = %s ORDER BY created_at DESC",
                    (user['id'],)
                )
                loans = [loan_to_dict(r) for r in cur.fetchall()]
                return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'loans': loans})}

        body = json.loads(event.get('body') or '{}')

        # POST создать заявку
        if method == 'POST':
            amount = int(body.get('amount', 0))
            days = int(body.get('days', 0))
            total_payment = int(body.get('total_payment', amount))
            due_date = body.get('due_date')
            cur.execute(
                "INSERT INTO loan_applications (user_id, amount, days, total_payment, due_date, status) "
                "VALUES (%s, %s, %s, %s, %s, 'pending') RETURNING id, user_id, amount, days, total_payment, due_date, status, created_at",
                (user['id'], amount, days, total_payment, due_date)
            )
            return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'loan': loan_to_dict(cur.fetchone())})}

        # PUT сменить статус (только админ)
        if method == 'PUT':
            if user['role'] != 'admin':
                return {'statusCode': 403, 'headers': cors_headers(), 'body': json.dumps({'error': 'forbidden'})}
            loan_id = int(body.get('id', 0))
            status = body.get('status', '')
            if status not in ('pending', 'approved', 'rejected'):
                return {'statusCode': 400, 'headers': cors_headers(), 'body': json.dumps({'error': 'bad status'})}
            cur.execute(
                "UPDATE loan_applications SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                (status, loan_id)
            )
            return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'ok': True})}

        return {'statusCode': 400, 'headers': cors_headers(), 'body': json.dumps({'error': 'bad request'})}
    finally:
        cur.close()
        conn.close()
