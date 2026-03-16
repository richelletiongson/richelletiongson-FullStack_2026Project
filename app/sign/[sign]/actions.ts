'use server';

import type { Prediction } from '@/lib/db';
import { getDb } from '@/lib/db';

export async function getPredictionsForSignMonth(
  sign: string,
  monthId: number | null
): Promise<Prediction[]> {
  const db = getDb();
  if (monthId !== null) {
    return db
      .prepare(
        `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026 
         WHERE sign = ? AND month_id = ? ORDER BY category`
      )
      .all(sign, monthId) as Prediction[];
  }
  return db
    .prepare(
      `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026 
       WHERE sign = ? ORDER BY month_id, category`
    )
    .all(sign) as Prediction[];
}
