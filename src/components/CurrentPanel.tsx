'use client';

import type { CurrentConditions } from '@/types';
import { formatTemp, useUnits } from '@/lib/units';

export function CurrentPanel({ current, place }: { current: CurrentConditions; place: string }) {
  const { unit } = useUnits();
  return (
    <section className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 p-8 text-white">
      <p className="text-sm uppercase tracking-wide text-slate-300">{place}</p>
      <div className="mt-3 flex items-center gap-5">
        <span className="text-6xl leading-none">{current.condition.icon}</span>
        <div>
          <p className="text-6xl font-semibold">{formatTemp(current.temperature, unit)}</p>
          <p className="text-slate-300">{current.condition.label}</p>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="text-slate-400">Feels like</dt>
          <dd className="font-medium">{formatTemp(current.feelsLike, unit)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Humidity</dt>
          <dd className="font-medium">{current.humidity}%</dd>
        </div>
        <div>
          <dt className="text-slate-400">Wind</dt>
          <dd className="font-medium">{Math.round(current.windSpeed)} km/h</dd>
        </div>
      </dl>
    </section>
  );
}