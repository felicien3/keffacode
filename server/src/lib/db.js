import "dotenv/config";
import fs from "node:fs/promises";
import pg from "pg";

import { ensureLearningNotes, seedDatabase } from "../../db/setup.js";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

export const query = (text, params) => pool.query(text, params);

export async function ensureDatabaseReady() {
  try {
    const schemaSql = await fs.readFile(
      new URL("../../db/schema.sql", import.meta.url),
      "utf8",
    );
    const {
      rows: [{ exists }],
    } = await query(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'users'
      ) AS exists;
    `);

    if (!exists) {
      await query(schemaSql);
      console.log("Database schema initialized");
    }

    const {
      rows: [{ total }],
    } = await query("SELECT COUNT(*)::int AS total FROM categories");

    if (Number(total) === 0) {
      await seedDatabase();
      console.log("Database demo content initialized");
    }

    await ensureLearningNotes();
  } catch (error) {
    console.error(
      "Database connection failed. Check your PostgreSQL credentials in server/.env",
    );
    console.error(
      "Expected DATABASE_URL format: postgres://<user>:<password>@localhost:5432/keffacode",
    );
    throw error;
  }
}
