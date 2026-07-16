
import "dotenv/config";
import bcrypt from "bcrypt";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
  connectionTimeoutMillis: 15000,
});

async function seed() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const passwordHash = await bcrypt.hash("P@$$w0rd!", 12);

    await client.query(
      `INSERT INTO users
        (first_name, last_name, email, password_hash, role)
       VALUES
        ('Owner', 'Account', 'owner@test.com', $1, 'owner'),
        ('Employee', 'Account', 'employee@test.com', $1, 'employee'),
        ('User', 'Account', 'user@test.com', $1, 'user')
       ON CONFLICT (email) DO NOTHING`,
      [passwordHash]
    );

    await client.query(`
      INSERT INTO categories (category_name)
      VALUES ('Trucks'), ('Vans'), ('Cars'), ('SUVs')
      ON CONFLICT (category_name) DO NOTHING
    `);

    await client.query(`
      INSERT INTO vehicles
        (category_id, make, model, year, mileage, price, description, availability)
      SELECT
        c.category_id,
        v.make,
        v.model,
        v.year,
        v.mileage,
        v.price,
        v.description,
        'Available'
      FROM (
        VALUES
          ('Trucks', 'Ford', 'F-150', 2020, 58300, 28995.00,
           'Reliable truck with towing package and clean interior.'),
          ('SUVs', 'Toyota', 'RAV4', 2021, 41200, 26500.00,
           'Fuel efficient SUV with all wheel drive and safety features.'),
          ('Cars', 'Honda', 'Civic', 2019, 64900, 18995.00,
           'Affordable sedan with great gas mileage and backup camera.'),
          ('Vans', 'Chrysler', 'Pacifica', 2020, 55200, 23995.00,
           'Family van with sliding doors, spacious seating, and cargo room.')
      ) AS v(category, make, model, year, mileage, price, description)
      JOIN categories c
        ON c.category_name = v.category
      WHERE NOT EXISTS (
        SELECT 1 FROM vehicles
      )
    `);

    await client.query(`
      INSERT INTO vehicle_images (vehicle_id, image_url, is_primary)
      SELECT
        v.vehicle_id,
        '/images/placeholder.svg',
        true
      FROM vehicles v
      WHERE NOT EXISTS (
        SELECT 1
        FROM vehicle_images vi
        WHERE vi.vehicle_id = v.vehicle_id
      )
    `);

    await client.query("COMMIT");

    console.log(
      "Database seeded successfully. Test password for all accounts: P@$$w0rd!"
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();