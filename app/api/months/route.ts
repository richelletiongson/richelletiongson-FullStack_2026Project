import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { Month } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT month_id, name FROM months ORDER BY month_id').all() as Month[];
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to fetch months' },
      { status: 500 }
    );
  }
}
