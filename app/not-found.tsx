import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4">
      <h1 className="font-display text-2xl font-bold text-[var(--text)]">
        Page not found
      </h1>
      <Link
        href="/"
        className="mt-4 text-[var(--accent)] hover:underline"
      >
        Back to home
      </Link>
    </main>
  );
}
