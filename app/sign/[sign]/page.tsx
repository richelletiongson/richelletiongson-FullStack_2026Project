import { notFound } from 'next/navigation';
import { getMonths } from '@/lib/db';
import { getPredictionsForSignMonth } from './actions';

const CATEGORIES = ['Love', 'Money', 'Career', 'Family', 'Health'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  Love: 'Love',
  Money: 'Money',
  Career: 'Career',
  Family: 'Family',
  Health: 'Health',
};

type Props = { params: Promise<{ sign: string }> };

export default async function SignPage({ params }: Props) {
  const { sign } = await params;
  const decodedSign = decodeURIComponent(sign);

  const [months, allPredictions] = await Promise.all([
    getMonths(),
    getPredictionsForSignMonth(decodedSign, null),
  ]);

  if (allPredictions.length === 0) {
    notFound();
  }

  const monthIds = Array.from(new Set(allPredictions.map((p) => p.month_id))).sort(
    (a, b) => a - b
  );
  const monthMap = new Map(months.map((m) => [m.month_id, m.name]));

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <nav className="mb-8" aria-label="Back to home">
          <a
            href="/"
            className="inline-block py-2 pr-2 text-[var(--text-muted)] hover:text-[var(--accent)] focus:outline-none cursor-pointer"
          >
            ← Back
          </a>
        </nav>

        <h1 className="font-display text-3xl font-bold text-[var(--text)]">
          {decodedSign} · 2026
        </h1>
        <p className="mt-1 text-[var(--text-muted)]">
          Monthly forecasts by category
        </p>

        <ul className="mt-8 space-y-6">
          {monthIds.map((monthId) => {
            const monthName = monthMap.get(monthId) ?? `Month ${monthId}`;
            const predictions = allPredictions.filter((p) => p.month_id === monthId);
            const byCategory = Object.fromEntries(
              predictions.map((p) => [p.category, p.prediction])
            );

            return (
              <li
                key={monthId}
                className="rounded-[var(--radius)] border border-[var(--surface-hover)] bg-[var(--surface)] p-5"
              >
                <h2 className="text-lg font-semibold text-[var(--accent)]">
                  {monthName}
                </h2>
                <ul className="mt-4 space-y-3">
                  {CATEGORIES.map((cat) => {
                    const text = byCategory[cat];
                    if (!text) return null;
                    return (
                      <li key={cat}>
                        <span className="text-sm font-medium text-[var(--text-muted)]">
                          {CATEGORY_LABELS[cat] ?? cat}
                        </span>
                        <p className="mt-0.5 text-[var(--text)]">{text}</p>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
