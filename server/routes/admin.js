import express from "express";
import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/admin/users - Neuen Benutzer erstellen
router.post("/users", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username und Passwort erforderlich" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Passwort muss mindestens 8 Zeichen lang sein" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password_hash, force_password_change) VALUES ($1, $2, true) RETURNING id, username",
      [username, hashedPassword]
    );

    res.status(201).json({
      message: "Benutzer erfolgreich erstellt",
      user: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username existiert bereits" });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users - Alle Benutzer auflisten
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, force_password_change, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id - Benutzer löschen
router.delete("/users/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "Benutzer gelöscht" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
