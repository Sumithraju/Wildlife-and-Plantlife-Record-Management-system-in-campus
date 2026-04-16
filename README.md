# Wildlife & Plantlife Record Management System
### Campus Biodiversity Portal — Group 1

A full-stack web application for recording, managing, and visualising wildlife and plant observations on campus.

**Stack:** React · Node.js/Express · PostgreSQL · Docker · Nginx

---

## Quick Start (Docker — Recommended)

> Runs the entire application with one command. No Node.js or PostgreSQL installation needed.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run

```bash
docker compose up --build -d
```

### Reset passwords (first time only)

```bash
docker exec -it wildlife_backend node scripts/resetPasswords.js
```

### Access

| Service    | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:3000        |
| Backend API| http://localhost:5002        |
| pgAdmin    | http://localhost:5050        |
| PostgreSQL | localhost:5433               |

### Stop

```bash
docker compose down
```

---

## Local Development (Without Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL 15+

### 1. Database Setup

```bash
psql -U postgres -h 127.0.0.1
```

```sql
CREATE USER wildlife_user WITH PASSWORD 'wildlife_pass';
CREATE DATABASE wildlife_campus OWNER wildlife_user;
GRANT ALL PRIVILEGES ON DATABASE wildlife_campus TO wildlife_user;
\q
```

```bash
psql -U wildlife_user -h 127.0.0.1 -d wildlife_campus -f database/init.sql
psql -U wildlife_user -h 127.0.0.1 -d wildlife_campus -f database/seed.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5001
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=wildlife_campus
DB_USER=wildlife_user
DB_PASSWORD=wildlife_pass
JWT_SECRET=campus_wildlife_jwt_secret_2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

```bash
node scripts/resetPasswords.js
npm run dev
```

Backend runs at: http://localhost:5001

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

---

## Demo Login Credentials

| Role       | Email                    | Password      |
|------------|--------------------------|---------------|
| Admin      | admin@campus.edu         | Admin@123     |
| Researcher | sarah.chen@campus.edu    | Research@123  |
| Researcher | james.ok@campus.edu      | Research@123  |
| Researcher | priya.s@campus.edu       | Research@123  |
| Viewer     | viewer@campus.edu        | Viewer@123    |

---

## Database (pgAdmin)

1. Open http://localhost:5050
2. Login: `admin@campus.edu` / `Admin@123`
3. Add New Server:
   - Host: `db`
   - Port: `5432`
   - Database: `wildlife_campus`
   - Username: `wildlife_user`
   - Password: `wildlife_pass`

### Connect via DBeaver (local dev)

- Host: `127.0.0.1`
- Port: `5433` (Docker) or `5432` (local)
- Database: `wildlife_campus`
- Username: `wildlife_user`
- Password: `wildlife_pass`

---

## Live Demo (IBAB Network)

The application is hosted on a MacBook Air M4 registered with the IBAB institute network.

> No setup required on the viewer's side — just open a browser.

**Demo URL:**
```
http://10.52.92.90:3000
```

Any device connected to the IBAB network can access the application directly in their browser. The entire stack (frontend, backend, database) runs inside Docker on the host machine.

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # JWT auth, file upload
│   │   ├── models/       # Database queries
│   │   └── routes/       # API endpoints
│   ├── scripts/          # Utility scripts
│   └── tests/            # Jest + Supertest tests
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # React pages
│   │   └── api/          # Axios API calls
│   └── tests/            # React Testing Library tests
├── database/
│   ├── init.sql          # Schema, ENUMs, triggers
│   └── seed.sql          # 5 users, 30 wildlife, 25 plant records
└── docker-compose.yml
```

---

## API Endpoints

| Method | Endpoint                  | Description            | Auth       |
|--------|---------------------------|------------------------|------------|
| POST   | /api/auth/login           | Login                  | Public     |
| POST   | /api/auth/register        | Register               | Public     |
| GET    | /api/wildlife             | List wildlife records  | Required   |
| POST   | /api/wildlife             | Create wildlife record | Researcher |
| PUT    | /api/wildlife/:id         | Update record          | Researcher |
| DELETE | /api/wildlife/:id         | Delete record          | Admin      |
| GET    | /api/plants               | List plant records     | Required   |
| POST   | /api/plants               | Create plant record    | Researcher |
| PUT    | /api/plants/:id           | Update record          | Researcher |
| DELETE | /api/plants/:id           | Delete record          | Admin      |
| GET    | /api/users                | List users             | Admin      |

---

## Running Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```
