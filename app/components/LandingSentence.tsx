'use client';

import { useRouter } from 'next/navigation';

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'Love', label: 'love' },
  { value: 'Money', label: 'money' },
  { value: 'Career', label: 'career' },
  { value: 'Family', label: 'family' },
  { value: 'Health', label: 'health' },
];

type Month = { month_id: number; name: string };

export default function LandingSentence({ months }: { months: Month[] }) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const sign = (form.elements.namedItem('sign') as HTMLSelectElement).value;
    const category = (form.elements.namedItem('category') as HTMLSelectElement).value;
    const month_id = (form.elements.namedItem('month_id') as HTMLSelectElement).value;
    if (sign && category && month_id) {
      router.push(
        `/forecast?sign=${encodeURIComponent(sign)}&category=${encodeURIComponent(category)}&month_id=${month_id}`
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-lg sm:text-xl">
      <span className="text-[var(--text)]">I'm</span>
      <select
        name="sign"
        required
        className="rounded-lg border border-[var(--surface-hover)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      >
        <option value="">choose sign</option>
        {SIGNS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <span className="text-[var(--text)]">, and I'd love to know what the stars have in store for my</span>
      <select
        name="category"
        required
        className="rounded-lg border border-[var(--surface-hover)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      >
        <option value="">choose</option>
        {CATEGORIES.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <span className="text-[var(--text)]">in</span>
      <select
        name="month_id"
        required
        className="rounded-lg border border-[var(--surface-hover)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      >
        <option value="">month</option>
        {months.map((m) => (
          <option key={m.month_id} value={m.month_id}>{m.name}</option>
        ))}
      </select>
      <span className="text-[var(--text)]">.</span>
      <button
        type="submit"
        className="ml-2 rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
      >
        See my forecast
      </button>
    </form>
  );
}
