-- Enable pgcrypto so password hashing helpers are available if needed.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Core user accounts for customers, employees, and owners.
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('owner','employee','user')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Vehicle categories used to group inventory items.
CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(50) UNIQUE NOT NULL
);

-- Main inventory table for cars available for sale.
CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900),
  mileage INTEGER NOT NULL CHECK (mileage >= 0),
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  description TEXT NOT NULL,
  availability VARCHAR(20) NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Store one or more image URLs for each vehicle.
CREATE TABLE IF NOT EXISTS vehicle_images (
  image_id SERIAL PRIMARY KEY,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false
);

-- Customer feedback attached to specific vehicles.
CREATE TABLE IF NOT EXISTS reviews (
  review_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Service requests created by users and managed by employees/owners.
CREATE TABLE IF NOT EXISTS service_requests (
  request_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  vehicle_id INTEGER REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
  service_type VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted','In Progress','Completed')),
  employee_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Contact form submissions from site visitors.
CREATE TABLE IF NOT EXISTS contact_messages (
  message_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  subject VARCHAR(120),
  message TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Received' CHECK (status IN ('Received','Replied','Closed')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Session table required by connect-pg-simple for storing Express sessions.
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

-- Ensure the session table has a primary key on the session ID.
DO $$ BEGIN
  ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Index sessions by expiry to support cleanup and lookup.
CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);
