import pool from "./database.js";

export async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        force_password_change BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_username ON users(username);
    `);
    console.log("✅ Datenbank initialisiert");
  } catch (err) {
    console.error("❌ Fehler beim Initialisieren der Datenbank:", err);
  }
}
