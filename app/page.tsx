import { getMonths } from '@/lib/db';
import LandingSentence from './components/LandingSentence';

export default async function HomePage() {
  const months = await getMonths();
  return (
    <main className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <p className="text-center text-[var(--text-muted)] text-sm mb-8">
          Horoscope 2026
        </p>
        <LandingSentence months={months} />
      </div>
    </main>
  );
}
