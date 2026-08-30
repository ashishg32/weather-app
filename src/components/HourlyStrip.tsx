'use client';

import type { HourlyPoint } from '@/types';
import { formatTemp, useUnits } from '@/lib/units';

export function HourlyStrip({ hourly, timezone }: { hourly: HourlyPoint[]; timezone: string }) {
  const { unit } = useUnits();

  const fmt = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    timeZone: timezone,
  });

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Next 24 hours
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {hourly.map((h, i) => (
          <div
            key={h.time}
            className="flex min-w-[76px] flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-3"
          >
            <span className="text-xs text-slate-500">
              {i === 0 ? 'Now' : fmt.format(new Date(h.time))}
            </span>
            <span className="text-2xl">{h.condition.icon}</span>
            <span className="font-medium text-slate-900">{formatTemp(h.temperature, unit)}</span>
            {h.precipitationProbability !== null && (
              <span className="text-xs text-sky-600">{h.precipitationProbability}%</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}