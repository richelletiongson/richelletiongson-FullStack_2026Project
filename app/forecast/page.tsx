import { getMonths, getPrediction } from '@/lib/db';
import CookieForecast from '@/app/components/CookieForecast';

const backLinkClass =
  'inline-block py-2 pr-2 text-[var(--text-muted)] hover:text-[var(--accent)] focus:text-[var(--accent)] focus:outline-none cursor-pointer';

type Props = { searchParams: Promise<{ sign?: string; category?: string; month_id?: string }> };

export default async function ForecastPage({ searchParams }: Props) {
  const params = await searchParams;
  const sign = params.sign ?? '';
  const category = params.category ?? '';
  const monthId = params.month_id ? parseInt(params.month_id, 10) : NaN;

  const months = await getMonths();
  const monthMap = new Map(months.map((m) => [m.month_id, m.name]));
  const monthName = monthMap.get(monthId) ?? '';

  const prediction =
    sign && category && !Number.isNaN(monthId)
      ? await getPrediction(sign, monthId, category)
      : null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <nav className="mb-8" aria-label="Back to home">
          <a href="/" className={backLinkClass}>
            ← Back
          </a>
        </nav>

        {prediction ? (
          <CookieForecast
            label={`${sign} · ${category} · ${monthName} 2026`}
            prediction={prediction.prediction}
          />
        ) : (
          <div className="rounded-[var(--radius)] border border-[var(--surface-hover)] bg-[var(--surface)] p-6 text-center">
            <p className="text-[var(--text-muted)]">
              No forecast found for that combination. Please choose your sign, category, and month on the home page.
            </p>
            <a
              href="/"
              className="mt-4 inline-block py-2 text-[var(--accent)] hover:underline focus:outline-none cursor-pointer"
            >
              Try again
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
