import { NextResponse } from 'next/server';
import { getDistinctSigns } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const signs = await getDistinctSigns();
    return NextResponse.json(signs);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to fetch signs' },
      { status: 500 }
    );
  }
}
