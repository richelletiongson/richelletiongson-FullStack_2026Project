import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare(
        'SELECT DISTINCT sign FROM zodiac_predictions_2026 ORDER BY sign'
      )
      .all() as { sign: string }[];
    return NextResponse.json(rows.map((r) => r.sign));
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to fetch signs' },
      { status: 500 }
    );
  }
}
