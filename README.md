# Ministranten-Verwaltung mit Render

## Setup

### 1. Lokale Entwicklung

**Voraussetzungen:**
- Node.js 20+
- PostgreSQL

**Installation:**
```bash
cd server
npm install
```

**Environment Variables (.env):**
```env
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ministranten_db
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3000
```

**Server starten:**
```bash
npm run dev
```

### 2. Render Deployment

**PostgreSQL Datenbank:**
1. Render.com → Neuer Service → PostgreSQL
2. Connection String kopieren
3. In `.env` setzen

**Node.js Service:**
1. GitHub Repository verbinden
2. Deploy button klicken
3. Environment Variables setzen:
   - `DATABASE_URL`: Von PostgreSQL kopiert
   - `JWT_SECRET`: Starker Schlüssel
   - `NODE_ENV`: production

**Build Kommand:**
```
npm install
```

**Start Kommand:**
```
node server/server.js
```

### 3. Admin Benutzer erstellen

```bash
# Mit psql verbinden
psql postgresql://user:password@host:port/ministranten_db

# Admin erstellen (mit bcrypt hash)
INSERT INTO users (username, password_hash, force_password_change) 
VALUES ('admin', '$2a$10$...', false);
```

### 4. API Endpoints

**Login:**
```bash
POST /api/auth/login
{ "username": "admin", "password": "password" }
```

**Passwort ändern (authentifiziert):**
```bash
POST /api/auth/change-password
Header: Authorization: Bearer <token>
{ "currentPassword": "old", "newPassword": "new" }
```

**Admin: Benutzer erstellen:**
```bash
POST /api/admin/users
Header: Authorization: Bearer <admin-token>
{ "username": "user1", "password": "secure123" }
```

**Admin: Benutzer auflisten:**
```bash
GET /api/admin/users
Header: Authorization: Bearer <admin-token>
```
