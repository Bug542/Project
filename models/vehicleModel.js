import { query } from './db.js';

export async function getCategories() {
  return query('SELECT * FROM categories ORDER BY category_name');
}

export async function getFeaturedVehicles() {
  return query(`SELECT v.*, c.category_name, vi.image_url
    FROM vehicles v
    JOIN categories c ON v.category_id = c.category_id
    LEFT JOIN vehicle_images vi ON v.vehicle_id = vi.vehicle_id AND vi.is_primary = true
    WHERE v.availability = 'Available'
    ORDER BY v.created_at DESC LIMIT 3`);
}

export async function getVehicles(categoryId) {
  const sql = `SELECT v.*, c.category_name, vi.image_url
    FROM vehicles v
    JOIN categories c ON v.category_id = c.category_id
    LEFT JOIN vehicle_images vi ON v.vehicle_id = vi.vehicle_id AND vi.is_primary = true
    ${categoryId ? 'WHERE v.category_id = $1' : ''}
    ORDER BY v.created_at DESC`;
  return query(sql, categoryId ? [categoryId] : []);
}

export async function getVehicleById(id) {
  const rows = await query(`SELECT v.*, c.category_name
    FROM vehicles v JOIN categories c ON v.category_id = c.category_id
    WHERE v.vehicle_id = $1`, [id]);
  return rows[0];
}

export async function getVehicleImages(id) {
  return query('SELECT * FROM vehicle_images WHERE vehicle_id = $1 ORDER BY is_primary DESC, image_id', [id]);
}

export async function createVehicle(data) {
  const rows = await query(`INSERT INTO vehicles (category_id, make, model, year, mileage, price, description, availability)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING vehicle_id`,
    [data.categoryId, data.make, data.model, data.year, data.mileage, data.price, data.description, data.availability]);
  return rows[0];
}

export async function updateVehicle(id, data) {
  return query(`UPDATE vehicles SET category_id=$1, make=$2, model=$3, year=$4, mileage=$5, price=$6, description=$7, availability=$8 WHERE vehicle_id=$9`,
    [data.categoryId, data.make, data.model, data.year, data.mileage, data.price, data.description, data.availability, id]);
}

export async function deleteVehicle(id) {
  return query('DELETE FROM vehicles WHERE vehicle_id = $1', [id]);
}

export async function createCategory(name) {
  return query('INSERT INTO categories (category_name) VALUES ($1)', [name]);
}

export async function deleteCategory(id) {
  return query('DELETE FROM categories WHERE category_id = $1', [id]);
}

export async function addVehicleImage(vehicleId, imageUrl, isPrimary = false) {
  return query('INSERT INTO vehicle_images (vehicle_id, image_url, is_primary) VALUES ($1,$2,$3)', [vehicleId, imageUrl, isPrimary]);
}
