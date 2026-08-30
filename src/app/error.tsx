'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-slate-700">Could not load the forecast.</p>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
      >
        Try again
      </button>
    </main>
  );
}