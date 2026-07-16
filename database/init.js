import "dotenv/config";
import fs from "fs";
import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initializeDatabase() {
  try {
    await client.connect();

    const schema = fs.readFileSync("database/schema.sql", "utf8");
    await client.query(schema);

    console.log("Database tables created successfully.");
  } catch (error) {
    console.error("Database initialization failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

initializeDatabase();