import { query } from './db.js';

export async function findUserByEmail(email) {
  const rows = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
}

export async function findUserById(id) {
  const rows = await query('SELECT user_id, first_name, last_name, email, role, created_at FROM users WHERE user_id = $1', [id]);
  return rows[0];
}

export async function createUser({ firstName, lastName, email, passwordHash, role = 'user' }) {
  const rows = await query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING user_id, first_name, last_name, email, role`,
    [firstName, lastName, email, passwordHash, role]
  );
  return rows[0];
}

export async function getAllUsers() {
  return query('SELECT user_id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC');
}

export async function updateUserRole(userId, role) {
  return query('UPDATE users SET role = $1 WHERE user_id = $2', [role, userId]);
}
