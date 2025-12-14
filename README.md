# PostIt - Group AX

A social media post application built with Vue.js and Node.js.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (running)

## Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):
```
PORT=3000
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/wad2025_db
JWT_SECRET=SECRET_KEY
```

Start the backend:
```bash
npm run dev
```

The backend will automatically:
- Create the database if it doesn't exist
- Create the required tables
- Seed initial posts data on first run

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts/:id/like` | Like a post |
| POST | `/api/posts/reset-likes` | Reset all likes |
