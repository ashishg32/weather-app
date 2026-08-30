'use client';

import type { DailyPoint } from '@/types';
import { formatTemp, useUnits } from '@/lib/units';

export function DailyGrid({ daily }: { daily: DailyPoint[] }) {
  const { unit } = useUnits();
  const fmt = new Intl.DateTimeFormat('en', { weekday: 'short' });

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        7-day outlook
      </h2>
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {daily.map((d, i) => (
          <li key={d.date} className="flex items-center gap-4 px-4 py-3">
            <span className="w-14 text-sm font-medium text-slate-700">
              {i === 0 ? 'Today' : fmt.format(new Date(`${d.date}T12:00:00`))}
            </span>
            <span className="text-xl">{d.condition.icon}</span>
            <span className="flex-1 text-sm text-slate-500">{d.condition.label}</span>
            {d.precipitationProbability !== null && (
              <span className="text-xs text-sky-600">{d.precipitationProbability}%</span>
            )}
            <span className="w-20 text-right text-sm">
              <span className="font-medium text-slate-900">{formatTemp(d.max, unit)}</span>
              <span className="ml-2 text-slate-400">{formatTemp(d.min, unit)}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}