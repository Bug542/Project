import 'dotenv/config';
import bcrypt from 'bcrypt';
import { pool } from '../models/db.js';

const passwordHash = await bcrypt.hash('P@$$w0rd!', 12);

async function seed() {
  await pool.query('BEGIN');
  try {
    await pool.query(`INSERT INTO users (first_name,last_name,email,password_hash,role) VALUES
      ('Owner','Account','owner@test.com',$1,'owner'),
      ('Employee','Account','employee@test.com',$1,'employee'),
      ('User','Account','user@test.com',$1,'user')
      ON CONFLICT (email) DO NOTHING`, [passwordHash]);

    await pool.query(`INSERT INTO categories (category_name) VALUES
      ('Trucks'),('Vans'),('Cars'),('SUVs') ON CONFLICT (category_name) DO NOTHING`);

    await pool.query(`INSERT INTO vehicles (category_id, make, model, year, mileage, price, description, availability)
      SELECT c.category_id, v.make, v.model, v.year, v.mileage, v.price, v.description, 'Available'
      FROM (VALUES
        ('Trucks','Ford','F-150',2020,58300,28995.00,'Reliable truck with towing package and clean interior.'),
        ('SUVs','Toyota','RAV4',2021,41200,26500.00,'Fuel efficient SUV with all wheel drive and safety features.'),
        ('Cars','Honda','Civic',2019,64900,18995.00,'Affordable sedan with great gas mileage and backup camera.'),
        ('Vans','Chrysler','Pacifica',2020,55200,23995.00,'Family van with sliding doors, spacious seating, and cargo room.')
      ) AS v(category, make, model, year, mileage, price, description)
      JOIN categories c ON c.category_name = v.category
      WHERE NOT EXISTS (SELECT 1 FROM vehicles)`);

    await pool.query(`INSERT INTO vehicle_images (vehicle_id, image_url, is_primary)
      SELECT vehicle_id, '/images/placeholder.svg', true FROM vehicles
      WHERE NOT EXISTS (SELECT 1 FROM vehicle_images WHERE vehicle_images.vehicle_id = vehicles.vehicle_id)`);

    await pool.query('COMMIT');
    console.log('Database seeded. Test password for all accounts: P@$$w0rd!');
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  } finally {
    await pool.end();
  }
}

seed();
