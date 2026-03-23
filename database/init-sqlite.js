#!/usr/bin/env node
/**
 * The app uses PostgreSQL only (local or Supabase via DATABASE_URL).
 * Initialize the database with: npm run db:init
 */
console.error(
  'SQLite is no longer used. Set DATABASE_URL in .env and run: npm run db:init'
);
process.exit(1);
