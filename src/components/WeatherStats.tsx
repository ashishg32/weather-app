'use client';

import { useMemo } from 'react';
import type { HourlyPoint, DailyPoint } from '@/types';

type Props = {
  hourly: HourlyPoint[];
  daily: DailyPoint[];
};

export function WeatherStats({ hourly, daily }: Props) {
  // React Hook: useMemo computes statistics from hourly and daily data
  const stats = useMemo(() => {
    // Calculate average temperature from hourly data
    const avgTemp =
      hourly.reduce((sum, h) => sum + h.temperature, 0) / hourly.length;

    // Find highest precipitation probability
    const maxPrecip = Math.max(
      ...hourly.map((h) => h.precipitationProbability ?? 0)
    );

    // Count rainy days (precip > 50%)
    const rainyDays = daily.filter((d) => (d.precipitationProbability ?? 0) > 50).length;

    // Calculate temperature range for the week
    const allTemps = daily.flatMap((d) => [d.min, d.max]);
    const weekMin = Math.min(...allTemps);
    const weekMax = Math.max(...allTemps);

    // Group hours by temperature ranges
    const tempRanges = {
      cold: hourly.filter((h) => h.temperature < 10).length,
      mild: hourly.filter((h) => h.temperature >= 10 && h.temperature < 20).length,
      warm: hourly.filter((h) => h.temperature >= 20 && h.temperature < 30).length,
      hot: hourly.filter((h) => h.temperature >= 30).length,
    };

    return {
      avgTemp: Math.round(avgTemp),
      maxPrecip,
      rainyDays,
      weekMin: Math.round(weekMin),
      weekMax: Math.round(weekMax),
      tempRanges,
    };
  }, [hourly, daily]); // Only recompute when hourly or daily data changes

  // React Hook: useMemo formats presentation data
  const summary = useMemo(() => {
    const { avgTemp, rainyDays, weekMin, weekMax } = stats;

    let outlook = '';
    if (rainyDays > 4) {
      outlook = 'Expect a rainy week ahead';
    } else if (rainyDays > 2) {
      outlook = 'Some rain expected this week';
    } else if (weekMax > 30) {
      outlook = 'Hot weather ahead!';
    } else if (weekMin < 5) {
      outlook = 'Bundle up - cold days coming';
    } else {
      outlook = 'Pleasant weather expected';
    }

    return {
      outlook,
      range: `${weekMin}° - ${weekMax}°C`,
      avg: `${avgTemp}°C`,
    };
  }, [stats]); // Depends on stats, which is already memoized

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Weather Statistics</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-xs font-medium text-blue-900">Average Temp</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{summary.avg}</p>
        </div>

        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-xs font-medium text-purple-900">Week Range</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">{summary.range}</p>
        </div>

        <div className="rounded-lg bg-sky-50 p-4">
          <p className="text-xs font-medium text-sky-900">Max Precip</p>
          <p className="mt-1 text-2xl font-bold text-sky-600">{stats.maxPrecip}%</p>
        </div>

        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-xs font-medium text-amber-900">Rainy Days</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{stats.rainyDays}/7</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700">Outlook</p>
        <p className="mt-1 text-slate-600">{summary.outlook}</p>
      </div>

      {/* Show temperature distribution */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-slate-700">
          Temperature Distribution (next 24h)
        </p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Cold (&lt;10°C)</span>
            <span className="font-medium text-blue-600">{stats.tempRanges.cold} hours</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Mild (10-20°C)</span>
            <span className="font-medium text-green-600">{stats.tempRanges.mild} hours</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Warm (20-30°C)</span>
            <span className="font-medium text-orange-600">{stats.tempRanges.warm} hours</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Hot (&gt;30°C)</span>
            <span className="font-medium text-red-600">{stats.tempRanges.hot} hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
