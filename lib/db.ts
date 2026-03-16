import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'database', 'horoscope.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath, { readonly: true });
  }
  return db;
}

export type Prediction = {
  id: number;
  sign: string;
  month_id: number;
  category: string;
  prediction: string;
  created_at?: string;
};

export type Month = { month_id: number; name: string };

export function getMonths(): Month[] {
  const db = getDb();
  return db.prepare('SELECT month_id, name FROM months ORDER BY month_id').all() as Month[];
}

export function getPrediction(
  sign: string,
  monthId: number,
  category: string
): Prediction | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026 
       WHERE sign = ? AND month_id = ? AND category = ?`
    )
    .get(sign, monthId, category);
  return (row as Prediction) ?? null;
}
