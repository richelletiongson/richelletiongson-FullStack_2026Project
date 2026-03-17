# FullStack_2026Project — Horoscope 2026

Horoscope 2026 website: **HTML**, **CSS**, **JavaScript**, **Express.js**, **EJS**, **Node.js**, **PostgreSQL**.

## Tech stack

- **HTML** – structure of pages (rendered via EJS)
- **CSS** – styling in `public/css/style.css`
- **JavaScript** – client-side behavior; server-side via Node.js
- **Express.js** – routing and middleware
- **EJS** – server-side templating
- **PostgreSQL** – database (schema in `database/schema.pg.sql`)

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure PostgreSQL

Copy `.env.example` to `.env` and set your database URL:

```
DATABASE_URL=postgresql://username:password@localhost:5432/horoscope2026
PORT=3000
```

Create the database if needed (e.g. `createdb horoscope2026`).

### 3. Initialize database (first time only)

```bash
npm run db:init
```

This runs `database/schema.pg.sql` and loads all seed data (fire, earth, air, water signs; March–December 2026).

### 4. Start the server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the form to pick sign, category, and month, then view your forecast. You can also open a sign’s page from the links (e.g. `/sign/Aries`).

## Scripts

| Command | Description |
|--------|-------------|
| `npm run db:init` | Initialize PostgreSQL schema and load seeds |
| `npm run dev` | Start Express server |
| `npm start` | Same as `npm run dev` |

## Project structure

- `server.js` – Express app entry
- `routes/` – Express routes (home, forecast, sign)
- `views/` – EJS templates (layout, index, forecast, sign, 404)
- `public/` – Static files (CSS)
- `lib/db.js` – PostgreSQL connection and queries
- `database/` – `schema.pg.sql`, seed files, `init-db.js`

The previous **Next.js + React + SQLite** version is still in the `app/` folder for reference; the running app is now Express + EJS + PostgreSQL.
