#!/usr/bin/env node
/**
 * Admin-Benutzer erstellen Script
 * Nutzung: node init-admin.js <username> <password>
 */

import bcrypt from "bcryptjs";
import pool from "./config/database.js";
import { initializeDatabase } from "./config/init-db.js";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin(username, password) {
  try {
    // Datenbank initialisieren
    await initializeDatabase();

    if (!username || !password) {
      console.error("❌ Fehler: username und password erforderlich");
      console.log("Nutzung: node init-admin.js <username> <password>");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, password_hash, force_password_change) VALUES ($1, $2, false) ON CONFLICT (username) DO NOTHING",
      [username, hashedPassword]
    );

    console.log(`✅ Admin-Benutzer '${username}' erstellt oder existiert bereits`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Fehler:", err.message);
    process.exit(1);
  }
}

const [username, password] = process.argv.slice(2);
createAdmin(username, password);
