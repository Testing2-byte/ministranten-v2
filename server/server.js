import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import { authenticateToken } from "./middleware/auth.js";
import { initializeDatabase } from "./config/init-db.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Datenbank initialisieren
await initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Public Routes
app.use("/api/auth", authRoutes);

// Protected Admin Routes
app.use("/api/admin", authenticateToken, adminRoutes);

// Serve Client Files
app.use(express.static(join(__dirname, "../client")));
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../client/index.html"));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Nicht gefunden" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
