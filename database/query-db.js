#!/usr/bin/env node
/**
 * Example query script. Usage:
 *   node database/query-db.js [sign] [month_id] [category]
 * Examples:
 *   node database/query-db.js Aries 3
 *   node database/query-db.js Leo 7 Love
 */
const path = require('path');
const dbPath = path.join(__dirname, 'horoscope.db');

async function query() {
  let Database;
  try {
    Database = (await import('better-sqlite3')).default;
  } catch (e) {
    console.error('Run: npm install better-sqlite3');
    process.exit(1);
  }

  const db = new Database(dbPath, { readonly: true });
  const [sign, monthId, category] = process.argv.slice(2);

  let stmt, rows;
  if (sign && monthId && category) {
    stmt = db.prepare(
      'SELECT prediction FROM zodiac_predictions_2026 WHERE sign = ? AND month_id = ? AND category = ?'
    );
    rows = stmt.all(sign, parseInt(monthId, 10), category);
  } else if (sign && monthId) {
    stmt = db.prepare(
      'SELECT category, prediction FROM zodiac_predictions_2026 WHERE sign = ? AND month_id = ? ORDER BY category'
    );
    rows = stmt.all(sign, parseInt(monthId, 10));
  } else if (sign) {
    stmt = db.prepare(
      'SELECT month_id, category, prediction FROM zodiac_predictions_2026 WHERE sign = ? ORDER BY month_id, category'
    );
    rows = stmt.all(sign);
  } else {
    stmt = db.prepare('SELECT sign, COUNT(*) AS count FROM zodiac_predictions_2026 GROUP BY sign');
    rows = stmt.all();
  }

  console.log(JSON.stringify(rows, null, 2));
  db.close();
}

query().catch((err) => {
  console.error(err);
  process.exit(1);
});
