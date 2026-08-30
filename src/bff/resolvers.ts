import { fetchForecast, searchLocations } from './openMeteo';
import { toCondition } from './wmo';

export const resolvers = {
  Query: {
    searchLocations: async (
      _p: unknown,
      { query, limit }: { query: string; limit: number },
    ) => {
      const trimmed = query.trim();
      if (trimmed.length < 2) return [];
      const results = await searchLocations(trimmed, limit);
      return results.map((r) => ({
        id: String(r.id),
        name: r.name,
        country: r.country ?? null,
        admin1: r.admin1 ?? null,
        latitude: r.latitude,
        longitude: r.longitude,
      }));
    },

    forecast: async (
      _p: unknown,
      { latitude, longitude, days }: { latitude: number; longitude: number; days: number },
    ) => {
      const raw = await fetchForecast(latitude, longitude, days);

      // Open-Meteo returns parallel arrays. Zip them into row objects.
      let start = raw.hourly.time.findIndex((t) => t >= raw.current.time);
      start = start === -1 ? 0 : Math.max(0, start - 1);

      const hourly = raw.hourly.time
        .slice(start, start + 24)
        .map((time, i) => {
          const idx = start + i;
          return {
            time,
            temperature: raw.hourly.temperature_2m[idx]!,
            precipitationProbability: raw.hourly.precipitation_probability?.[idx] ?? null,
            condition: toCondition(raw.hourly.weather_code[idx]!),
          };
        });

      const daily = raw.daily.time.map((date, i) => ({
        date,
        min: raw.daily.temperature_2m_min[i]!,
        max: raw.daily.temperature_2m_max[i]!,
        precipitationProbability: raw.daily.precipitation_probability_max?.[i] ?? null,
        sunrise: raw.daily.sunrise[i]!,
        sunset: raw.daily.sunset[i]!,
        condition: toCondition(raw.daily.weather_code[i]!),
      }));

      return {
        timezone: raw.timezone,
        current: {
          time: raw.current.time,
          temperature: raw.current.temperature_2m,
          feelsLike: raw.current.apparent_temperature,
          humidity: raw.current.relative_humidity_2m,
          windSpeed: raw.current.wind_speed_10m,
          isDay: raw.current.is_day === 1,
          condition: toCondition(raw.current.weather_code),
        },
        hourly,
        daily,
      };
    },
  },
};