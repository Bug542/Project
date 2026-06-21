import { query } from './db.js';

export async function createServiceRequest(data) {
  return query(`INSERT INTO service_requests (user_id, vehicle_id, service_type, description, status)
    VALUES ($1,$2,$3,$4,'Submitted')`, [data.userId, data.vehicleId || null, data.serviceType, data.description]);
}

export async function getUserServiceRequests(userId) {
  return query(`SELECT sr.*, v.year, v.make, v.model
    FROM service_requests sr LEFT JOIN vehicles v ON sr.vehicle_id = v.vehicle_id
    WHERE sr.user_id=$1 ORDER BY sr.created_at DESC`, [userId]);
}

export async function getAllServiceRequests() {
  return query(`SELECT sr.*, u.first_name, u.last_name, u.email, v.year, v.make, v.model
    FROM service_requests sr JOIN users u ON sr.user_id=u.user_id
    LEFT JOIN vehicles v ON sr.vehicle_id=v.vehicle_id
    ORDER BY sr.created_at DESC`);
}

export async function updateServiceRequest(id, status, notes) {
  return query('UPDATE service_requests SET status=$1, employee_notes=$2, updated_at=NOW() WHERE request_id=$3', [status, notes, id]);
}
