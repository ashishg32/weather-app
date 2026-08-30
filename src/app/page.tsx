import { Suspense } from 'react';
import Link from 'next/link';
import { executeServerQuery } from '@/bff/execute';
import type { Forecast } from '@/types';
import { LocationSearch } from '@/components/LocationSearch';
import { UnitToggle } from '@/components/UnitToggle';
import { CurrentPanel } from '@/components/CurrentPanel';
import { HourlyStrip } from '@/components/HourlyStrip';
import { DailyGrid } from '@/components/DailyGrid';

const FORECAST_QUERY = /* GraphQL */ `
  query Forecast($lat: Float!, $lon: Float!) {
    forecast(latitude: $lat, longitude: $lon, days: 7) {
      timezone
      current {
        time temperature feelsLike humidity windSpeed isDay
        condition { code label icon }
      }
      hourly {
        time temperature precipitationProbability
        condition { code label icon }
      }
      daily {
        date min max precipitationProbability sunrise sunset
        condition { code label icon }
      }
    }
  }
`;

const PRESETS = [
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo, JP', lat: 35.6762, lon: 139.6503 },
  { name: 'New York, US', lat: 40.7128, lon: -74.006 },
];

async function ForecastView({ lat, lon, name }: { lat: number; lon: number; name: string }) {
  const data = await executeServerQuery<{ forecast: Forecast }>(FORECAST_QUERY, { lat, lon });
  const f = data.forecast;

  return (
    <div className="space-y-8">
      <CurrentPanel current={f.current} place={name} />
      <HourlyStrip hourly={f.hourly} timezone={f.timezone} />
      <DailyGrid daily={f.daily} />
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lat?: string; lon?: string; name?: string }>;
}) {
  const sp = await searchParams;
  const lat = sp.lat ? Number(sp.lat) : null;
  const lon = sp.lon ? Number(sp.lon) : null;
  const name = sp.name ?? 'Selected location';
  const hasPlace = lat !== null && lon !== null && !Number.isNaN(lat) && !Number.isNaN(lon);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Weather</h1>
        <UnitToggle />
      </header>

      <div className="mb-10">
        <LocationSearch />
      </div>

      {hasPlace ? (
        <Suspense
          key={`${lat}-${lon}`}
          fallback={<div className="h-64 animate-pulse rounded-2xl bg-slate-200" />}
        >
          <ForecastView lat={lat} lon={lon} name={name} />
        </Suspense>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-600">Search for a city, or try one of these:</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {PRESETS.map((p) => (
              <Link
                key={p.name}
                href={`/?lat=${p.lat}&lon=${p.lon}&name=${encodeURIComponent(p.name)}`}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}