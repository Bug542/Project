import { query } from './db.js';

export async function getReviewsForVehicle(vehicleId) {
  return query(`SELECT r.*, u.first_name, u.last_name
    FROM reviews r JOIN users u ON r.user_id = u.user_id
    WHERE r.vehicle_id = $1 ORDER BY r.created_at DESC`, [vehicleId]);
}

export async function createReview(userId, vehicleId, rating, reviewText) {
  return query('INSERT INTO reviews (user_id, vehicle_id, rating, review_text) VALUES ($1,$2,$3,$4)', [userId, vehicleId, rating, reviewText]);
}

export async function getUserReviews(userId) {
  return query(`SELECT r.*, v.make, v.model, v.year
    FROM reviews r JOIN vehicles v ON r.vehicle_id = v.vehicle_id
    WHERE r.user_id = $1 ORDER BY r.created_at DESC`, [userId]);
}

export async function updateReview(reviewId, userId, rating, reviewText) {
  return query('UPDATE reviews SET rating=$1, review_text=$2 WHERE review_id=$3 AND user_id=$4', [rating, reviewText, reviewId, userId]);
}

export async function deleteReview(reviewId, userId = null) {
  const sql = userId ? 'DELETE FROM reviews WHERE review_id=$1 AND user_id=$2' : 'DELETE FROM reviews WHERE review_id=$1';
  return query(sql, userId ? [reviewId, userId] : [reviewId]);
}

export async function getAllReviews() {
  return query(`SELECT r.*, u.email, v.make, v.model, v.year
    FROM reviews r JOIN users u ON r.user_id = u.user_id
    JOIN vehicles v ON r.vehicle_id = v.vehicle_id
    ORDER BY r.created_at DESC`);
}
