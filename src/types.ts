export type Condition = { code: number; label: string; icon: string };

export type Location = {
  id: string;
  name: string;
  country: string | null;
  admin1: string | null;
  latitude: number;
  longitude: number;
};

export type CurrentConditions = {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  condition: Condition;
};

export type HourlyPoint = {
  time: string;
  temperature: number;
  precipitationProbability: number | null;
  condition: Condition;
};

export type DailyPoint = {
  date: string;
  min: number;
  max: number;
  precipitationProbability: number | null;
  sunrise: string;
  sunset: string;
  condition: Condition;
};

export type Forecast = {
  timezone: string;
  current: CurrentConditions;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
};