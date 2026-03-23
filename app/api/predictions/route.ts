import { NextRequest, NextResponse } from 'next/server';
import { getPrediction, getPredictionsForSignMonth } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get('sign');
  const monthId = searchParams.get('month_id');
  const category = searchParams.get('category');

  try {
    if (sign && monthId && category) {
      const row = await getPrediction(
        sign,
        parseInt(monthId, 10),
        category
      );
      return NextResponse.json(row ?? null);
    }

    if (sign && monthId) {
      const rows = await getPredictionsForSignMonth(
        sign,
        parseInt(monthId, 10)
      );
      return NextResponse.json(rows);
    }

    if (sign) {
      const rows = await getPredictionsForSignMonth(sign, null);
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
