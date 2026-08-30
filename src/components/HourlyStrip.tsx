'use client';

import { useMemo } from 'react';
import type { HourlyPoint } from '@/types';
import { formatTemp, useUnits } from '@/lib/units';

export function HourlyStrip({ hourly, timezone }: { hourly: HourlyPoint[]; timezone: string }) {
  const { unit } = useUnits();

  // React Hook: useMemo caches DateTimeFormat instance
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en', {
        hour: 'numeric',
        timeZone: timezone,
      }),
    [timezone] // Only recreate when timezone changes
  );

  // React Hook: useMemo transforms data only when dependencies change
  const displayHours = useMemo(() => {
    return hourly.slice(0, 24).map((h, i) => ({
      ...h,
      displayTime: i === 0 ? 'Now' : formatter.format(new Date(h.time)),
      displayTemp: formatTemp(h.temperature, unit),
    }));
  }, [hourly, formatter, unit]); // Recompute only when these change

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Next 24 hours
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {displayHours.map((h) => (
          <div
            key={h.time}
            className="flex min-w-[76px] flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-3"
          >
            <span className="text-xs text-slate-500">{h.displayTime}</span>
            <span className="text-2xl">{h.condition.icon}</span>
            <span className="font-medium text-slate-900">{h.displayTemp}</span>
            {h.precipitationProbability !== null && (
              <span className="text-xs text-sky-600">{h.precipitationProbability}%</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
