import { NextResponse } from 'next/server';
import { getMonths } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await getMonths();
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to fetch months' },
      { status: 500 }
    );
  }
}
