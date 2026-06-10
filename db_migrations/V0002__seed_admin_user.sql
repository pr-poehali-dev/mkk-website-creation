INSERT INTO users (phone, password_hash, full_name, role)
VALUES ('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Администратор', 'admin')
ON CONFLICT (phone) DO NOTHING;
