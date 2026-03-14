#!/usr/bin/env node
/**
 * Initialize SQLite database: create schema and load fire + earth signs seed data.
 * Run from project root: npm run db:init
 */
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'horoscope.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const seedFiles = ['seed_fire_signs.sql', 'seed_earth_signs.sql', 'seed_air_signs.sql', 'seed_water_signs.sql'];

async function init() {
  let Database;
  try {
    Database = (await import('better-sqlite3')).default;
  } catch (e) {
    console.error('Missing dependency. Run: npm install better-sqlite3');
    process.exit(1);
  }

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const db = new Database(dbPath);

  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  console.log('Schema created.');

  for (const file of seedFiles) {
    const seedPath = path.join(__dirname, file);
    const seed = fs.readFileSync(seedPath, 'utf8');
    db.exec(seed);
    console.log(`${file} loaded.`);
  }

  const count = db.prepare('SELECT COUNT(*) AS n FROM zodiac_predictions_2026').get();
  console.log(`Total predictions: ${count.n}`);
  db.close();
  console.log('Database ready at database/horoscope.db');
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
