'use client';

import { useUnits } from '@/lib/units';

export function UnitToggle() {
  const { unit, setUnit } = useUnits();
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-300">
      {(['c', 'f'] as const).map((u) => (
        <button
          key={u}
          onClick={() => setUnit(u)}
          className={`px-3 py-1.5 text-sm font-medium ${
            unit === u ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
          }`}
        >
          °{u.toUpperCase()}
        </button>
      ))}
    </div>
  );
}