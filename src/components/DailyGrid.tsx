'use client';

import { useMemo } from 'react';
import type { DailyPoint } from '@/types';
import { formatTemp, useUnits } from '@/lib/units';

export function DailyGrid({ daily }: { daily: DailyPoint[] }) {
  const { unit } = useUnits();

  // React Hook: useMemo transforms and caches daily forecast data
  const formattedDays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat('en', { weekday: 'short' });

    return daily.map((d, i) => ({
      ...d,
      displayDate: i === 0 ? 'Today' : fmt.format(new Date(`${d.date}T12:00:00`)),
      displayMin: formatTemp(d.min, unit),
      displayMax: formatTemp(d.max, unit),
    }));
  }, [daily, unit]); // Only recompute when daily array or unit changes

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        7-day outlook
      </h2>
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {formattedDays.map((d) => (
          <li key={d.date} className="flex items-center gap-4 px-4 py-3">
            <span className="w-14 text-sm font-medium text-slate-700">{d.displayDate}</span>
            <span className="text-xl">{d.condition.icon}</span>
            <span className="flex-1 text-sm text-slate-500">{d.condition.label}</span>
            {d.precipitationProbability !== null && (
              <span className="text-xs text-sky-600">{d.precipitationProbability}%</span>
            )}
            <span className="w-20 text-right text-sm">
              <span className="font-medium text-slate-900">{d.displayMax}</span>
              <span className="ml-2 text-slate-400">{d.displayMin}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}