import { query } from './db.js';

export async function createMessage({ name, email, subject, message }) {
  return query(`INSERT INTO contact_messages (name, email, subject, message, status)
    VALUES ($1,$2,$3,$4,'Received')`, [name, email, subject, message]);
}

export async function getAllMessages() {
  return query('SELECT * FROM contact_messages ORDER BY created_at DESC');
}

export async function updateMessageStatus(id, status) {
  return query('UPDATE contact_messages SET status=$1 WHERE message_id=$2', [status, id]);
}
