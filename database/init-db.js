#!/usr/bin/env node
/**
 * Initialize PostgreSQL: run schema and load seed data.
 * Requires DATABASE_URL in .env (or env). Run: npm run db:init
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const schemaPath = path.join(__dirname, 'schema.pg.sql');
const seedFiles = [
  'seed_fire_signs.sql',
  'seed_earth_signs.sql',
  'seed_air_signs.sql',
  'seed_water_signs.sql',
];

function getPgConfig() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    'postgresql://postgres:postgres@localhost:5432/horoscope2026';
  try {
    const url = new URL(connectionString);
    return {
      host: url.hostname,
      port: Number(url.port) || 5432,
      user: url.username || 'postgres',
      password: url.password !== undefined ? url.password : (process.env.PGPASSWORD ?? 'postgres'),
      database: (url.pathname.slice(1) || 'horoscope2026').replace(/%2F/gi, '/'),
    };
  } catch {
    return { connectionString };
  }
}

async function init() {
  const config = getPgConfig();
  if (config.connectionString) {
    const client = new Client({ connectionString: config.connectionString });
    await runInit(client);
    return;
  }
  const client = new Client(config);
  await runInit(client);
}

async function runInit(client) {

  try {
    await client.connect();
  } catch (e) {
    console.error(
      'Cannot connect to PostgreSQL. Set DATABASE_URL in .env (see .env.example).',
      e.message
    );
    process.exit(1);
  }

  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schema);
    console.log('Schema created.');

    await client.query('TRUNCATE zodiac_predictions_2026 RESTART IDENTITY');
    for (const file of seedFiles) {
      const seedPath = path.join(__dirname, file);
      if (!fs.existsSync(seedPath)) {
        console.warn(`Skip (not found): ${file}`);
        continue;
      }
      const seed = fs.readFileSync(seedPath, 'utf8');
      await client.query(seed);
      console.log(`${file} loaded.`);
    }

    const r = await client.query(
      'SELECT COUNT(*) AS n FROM zodiac_predictions_2026'
    );
    console.log(`Total predictions: ${r.rows[0].n}`);
    console.log('Database ready (PostgreSQL).');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

init();
