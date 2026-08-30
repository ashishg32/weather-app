'use client';

import { useState, useMemo, useCallback, useReducer, useTransition, useEffect } from 'react';

type FilterState = {
  searchTerm: string;
  minTemp: number;
  maxTemp: number;
  showRainyOnly: boolean;
};

type FilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_MIN_TEMP'; payload: number }
  | { type: 'SET_MAX_TEMP'; payload: number }
  | { type: 'TOGGLE_RAINY' }
  | { type: 'RESET' };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'SET_MIN_TEMP':
      return { ...state, minTemp: action.payload };
    case 'SET_MAX_TEMP':
      return { ...state, maxTemp: action.payload };
    case 'TOGGLE_RAINY':
      return { ...state, showRainyOnly: !state.showRainyOnly };
    case 'RESET':
      return { searchTerm: '', minTemp: -50, maxTemp: 50, showRainyOnly: false };
    default:
      return state;
  }
}

function generateSampleData() {
  return Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    city: `City ${i}`,
    temp: Math.round(Math.random() * 40 - 10),
    isRainy: Math.random() > 0.7,
  }));
}

export function CityFilter() {
  // Generate data only on client after mount to avoid hydration mismatch
  const [sampleData, setSampleData] = useState<ReturnType<typeof generateSampleData>>([]);

  useEffect(() => {
    setSampleData(generateSampleData());
  }, []);

  // React Hook: useState for simple toggle state
  const [showFilters, setShowFilters] = useState(true);

  // React Hook: useReducer manages complex filter state
  const [filters, dispatch] = useReducer(filterReducer, {
    searchTerm: '',
    minTemp: -50,
    maxTemp: 50,
    showRainyOnly: false,
  });

  // React Hook: useTransition keeps UI responsive during expensive operations
  const [isPending, startTransition] = useTransition();

  // React Hook: useCallback memoizes event handlers for performance
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Wrap in startTransition to make filtering non-blocking
    startTransition(() => {
      dispatch({ type: 'SET_SEARCH', payload: value });
    });
  }, []);

  const handleMinTempChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      dispatch({ type: 'SET_MIN_TEMP', payload: Number(e.target.value) });
    });
  }, []);

  const handleMaxTempChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      dispatch({ type: 'SET_MAX_TEMP', payload: Number(e.target.value) });
    });
  }, []);

  const handleToggleRainy = useCallback(() => {
    startTransition(() => {
      dispatch({ type: 'TOGGLE_RAINY' });
    });
  }, []);

  const handleReset = useCallback(() => {
    startTransition(() => {
      dispatch({ type: 'RESET' });
    });
  }, []);

  // React Hook: useMemo caches expensive filtering operations
  const filteredData = useMemo(() => {
    return sampleData.filter((item) => {
      const matchesSearch = item.city.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesTemp = item.temp >= filters.minTemp && item.temp <= filters.maxTemp;
      const matchesRainy = !filters.showRainyOnly || item.isRainy;

      return matchesSearch && matchesTemp && matchesRainy;
    });
  }, [filters, sampleData]);

  // React Hook: useMemo derives statistics from filtered data
  const stats = useMemo(() => {
    const total = filteredData.length;
    const rainyCount = filteredData.filter((d) => d.isRainy).length;
    const avgTemp =
      total > 0 ? filteredData.reduce((sum, d) => sum + d.temp, 0) / total : 0;

    return {
      total,
      rainyCount,
      avgTemp: avgTemp.toFixed(1),
      rainyPercent: total > 0 ? ((rainyCount / total) * 100).toFixed(0) : '0',
    };
  }, [filteredData]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">City Explorer</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {showFilters && (
        <div className="mb-4 space-y-3">
        <input
          type="text"
          value={filters.searchTerm}
          onChange={handleSearchChange}
          placeholder="Search cities..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-600">Min Temp: {filters.minTemp}°C</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={filters.minTemp}
              onChange={handleMinTempChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">Max Temp: {filters.maxTemp}°C</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={filters.maxTemp}
              onChange={handleMaxTempChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.showRainyOnly}
              onChange={handleToggleRainy}
              className="rounded"
            />
            <span>Show rainy only</span>
          </label>
          <button
            onClick={handleReset}
            className="rounded-lg bg-slate-200 px-3 py-1 text-xs hover:bg-slate-300"
          >
            Reset
          </button>
        </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-4 grid grid-cols-4 gap-2 rounded-lg bg-slate-50 p-3">
        <div className="text-center">
          <p className="text-xs text-slate-600">Results</p>
          <p className="text-lg font-bold text-slate-900">
            {isPending ? '...' : stats.total}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-600">Rainy</p>
          <p className="text-lg font-bold text-blue-600">
            {isPending ? '...' : stats.rainyCount}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-600">Avg Temp</p>
          <p className="text-lg font-bold text-orange-600">
            {isPending ? '...' : stats.avgTemp}°
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-600">% Rainy</p>
          <p className="text-lg font-bold text-sky-600">
            {isPending ? '...' : stats.rainyPercent}%
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="max-h-48 space-y-1 overflow-y-auto text-xs">
        {filteredData.slice(0, 50).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded border border-slate-100 bg-slate-50 px-2 py-1"
          >
            <span className="text-slate-700">{item.city}</span>
            <span className="flex items-center gap-2">
              <span className="font-medium text-slate-900">{item.temp}°C</span>
              {item.isRainy && <span className="text-blue-600">🌧️</span>}
            </span>
          </div>
        ))}
        {filteredData.length > 50 && (
          <p className="py-2 text-center text-slate-500">
            ...and {filteredData.length - 50} more
          </p>
        )}
      </div>
    </div>
  );
}
