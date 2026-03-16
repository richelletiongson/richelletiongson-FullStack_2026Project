'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CategoryCardSlider from './CategoryCardSlider';

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

type Month = { month_id: number; name: string };

export default function LandingSentence({ months }: { months: Month[] }) {
  const router = useRouter();
  const [category, setCategory] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const sign = (form.elements.namedItem('sign') as HTMLSelectElement).value;
    const month_id = (form.elements.namedItem('month_id') as HTMLSelectElement).value;
    const categoryValue =
      (form.elements.namedItem('category') as HTMLInputElement | null)?.value ?? '';
    if (sign && categoryValue && month_id) {
      router.push(
        `/forecast?sign=${encodeURIComponent(sign)}&category=${encodeURIComponent(categoryValue)}&month_id=${month_id}`
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center gap-6 text-lg sm:text-xl"
    >
      <input type="hidden" name="category" value={category} />

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
      <span className="text-[var(--text)]">I&apos;m</span>
      <select
        name="sign"
        required
        className="prettySelect"
      >
        <option value="">choose sign</option>
        {SIGNS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <span className="text-[var(--text)]">, and I&apos;d love to know what the stars have in store for my</span>
      </div>

      <div className="w-full">
        <CategoryCardSlider
          categories={[
            { value: 'Love', label: 'love', description: 'Heart, relationships' },
            { value: 'Money', label: 'money', description: 'Wealth, spending' },
            { value: 'Career', label: 'career', description: 'Work, goals' },
            { value: 'Family', label: 'family', description: 'Home, support' },
            { value: 'Health', label: 'health', description: 'Body, mind' },
          ]}
          selectedValue={category}
          onSelect={setCategory}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
        <span className="text-[var(--text)]">in</span>
        <select
          name="month_id"
          required
          className="prettySelect"
        >
          <option value="">month</option>
          {months.map((m) => (
            <option key={m.month_id} value={m.month_id}>{m.name}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="forecastBtn ml-2"
      >
        See my forecast
      </button>
    </form>
  );
}
