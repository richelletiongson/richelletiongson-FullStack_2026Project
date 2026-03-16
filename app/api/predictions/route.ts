import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { Prediction } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get('sign');
  const monthId = searchParams.get('month_id');
  const category = searchParams.get('category');

  try {
    const db = getDb();

    if (sign && monthId && category) {
      const row = db
        .prepare(
          `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026 
           WHERE sign = ? AND month_id = ? AND category = ?`
        )
        .get(sign, parseInt(monthId, 10), category) as Prediction | undefined;
      return NextResponse.json(row ?? null);
    }

    if (sign && monthId) {
      const rows = db
        .prepare(
          `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026 
           WHERE sign = ? AND month_id = ? ORDER BY category`
        )
        .all(sign, parseInt(monthId, 10)) as Prediction[];
      return NextResponse.json(rows);
    }

    if (sign) {
      const rows = db
        .prepare(
          `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026 
           WHERE sign = ? ORDER BY month_id, category`
        )
        .all(sign) as Prediction[];
      return NextResponse.json(rows);
    }

    return NextResponse.json(
      { error: 'Provide at least sign (optional: month_id, category)' },
      { status: 400 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}
