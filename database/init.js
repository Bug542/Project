import "dotenv/config";
import fs from "fs";
import pg from "pg";

const { Client } = pg;

// Create a PostgreSQL client using the database connection string from the environment.
// SSL is disabled for certificate verification in this local/development setup.
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Initialize the database by reading the SQL schema file and executing it.
async function initializeDatabase() {
  try {
    // Connect to the database before running any SQL.
    await client.connect();

    // Load the schema definition from disk and apply it to the database.
    const schema = fs.readFileSync("database/schema.sql", "utf8");
    await client.query(schema);

    console.log("Database tables created successfully.");
  } catch (error) {
    // Report any failure clearly and mark the process as unsuccessful.
    console.error("Database initialization failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    // Always close the database connection when setup is complete or has failed.
    await client.end();
  }
}

// Run the initialization when the script is executed.
initializeDatabase();