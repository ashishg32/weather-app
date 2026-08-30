'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useReducer, useCallback } from 'react';
import type { Location } from '@/types';

const SEARCH = gql`
  query SearchLocations($query: String!) {
    searchLocations(query: $query, limit: 6) {
      id
      name
      country
      admin1
      latitude
      longitude
    }
  }
`;

// React Hook: useReducer manages complex state with multiple related values
type SearchState = {
  term: string;
  debounced: string;
  open: boolean;
  active: number;
};

type SearchAction =
  | { type: 'SET_TERM'; payload: string }
  | { type: 'SET_DEBOUNCED'; payload: string }
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_ACTIVE'; payload: number }
  | { type: 'RESET_ACTIVE' }
  | { type: 'INCREMENT_ACTIVE'; maxIndex: number }
  | { type: 'DECREMENT_ACTIVE'; maxIndex: number }
  | { type: 'SELECT_LOCATION'; name: string };

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_TERM':
      return { ...state, term: action.payload, open: true, active: 0 };
    case 'SET_DEBOUNCED':
      return { ...state, debounced: action.payload };
    case 'SET_OPEN':
      return { ...state, open: action.payload };
    case 'SET_ACTIVE':
      return { ...state, active: action.payload };
    case 'RESET_ACTIVE':
      return { ...state, active: 0 };
    case 'INCREMENT_ACTIVE':
      return { ...state, active: (state.active + 1) % (action.maxIndex + 1) };
    case 'DECREMENT_ACTIVE':
      return {
        ...state,
        active: (state.active - 1 + action.maxIndex + 1) % (action.maxIndex + 1),
      };
    case 'SELECT_LOCATION':
      return { ...state, term: action.name, open: false };
    default:
      return state;
  }
}

export function LocationSearch() {
  const router = useRouter();

  // React Hook: useReducer consolidates related state
  const [state, dispatch] = useReducer(searchReducer, {
    term: '',
    debounced: '',
    open: false,
    active: 0,
  });

  const boxRef = useRef<HTMLDivElement>(null);

  // Debounce effect
  useEffect(() => {
    const id = setTimeout(() => {
      dispatch({ type: 'SET_DEBOUNCED', payload: state.term });
    }, 250);
    return () => clearTimeout(id);
  }, [state.term]);

  const { data, loading } = useQuery<{ searchLocations: Location[] }>(SEARCH, {
    variables: { query: state.debounced },
    skip: state.debounced.trim().length < 2,
  });

  const results = data?.searchLocations ?? [];

  // Click outside handler
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) {
        dispatch({ type: 'SET_OPEN', payload: false });
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // React Hook: useCallback memoizes function to prevent unnecessary re-renders
  const select = useCallback(
    (loc: Location) => {
      const label = [loc.name, loc.admin1, loc.country].filter(Boolean).join(', ');
      dispatch({ type: 'SELECT_LOCATION', name: loc.name });
      router.push(`/?lat=${loc.latitude}&lon=${loc.longitude}&name=${encodeURIComponent(label)}`);
    },
    [router]
  );

  // React Hook: useCallback for keyboard handler
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!state.open || results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          dispatch({ type: 'INCREMENT_ACTIVE', maxIndex: results.length - 1 });
          break;
        case 'ArrowUp':
          e.preventDefault();
          dispatch({ type: 'DECREMENT_ACTIVE', maxIndex: results.length - 1 });
          break;
        case 'Enter':
          e.preventDefault();
          if (results[state.active]) select(results[state.active]);
          break;
        case 'Escape':
          dispatch({ type: 'SET_OPEN', payload: false });
          break;
      }
    },
    [state.open, state.active, results, select]
  );

  // React Hook: useCallback for event handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_TERM', payload: e.target.value });
  }, []);

  const handleFocus = useCallback(() => {
    dispatch({ type: 'SET_OPEN', payload: true });
  }, []);

  const handleMouseEnter = useCallback((index: number) => {
    dispatch({ type: 'SET_ACTIVE', payload: index });
  }, []);

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={state.term}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        placeholder="Search for a city…"
        role="combobox"
        aria-expanded={state.open}
        aria-controls="location-listbox"
        aria-activedescendant={state.open && results[state.active] ? `loc-${results[state.active].id}` : undefined}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
      />

      {state.open && state.debounced.trim().length >= 2 && (
        <ul
          id="location-listbox"
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {loading && <li className="px-4 py-3 text-sm text-slate-500">Searching…</li>}
          {!loading && results.length === 0 && (
            <li className="px-4 py-3 text-sm text-slate-500">No matches found.</li>
          )}
          {results.map((loc, i) => (
            <li
              key={loc.id}
              id={`loc-${loc.id}`}
              role="option"
              aria-selected={i === state.active}
              onMouseEnter={() => handleMouseEnter(i)}
              onClick={() => select(loc)}
              className={`cursor-pointer px-4 py-3 text-sm ${
                i === state.active ? 'bg-slate-100' : ''
              }`}
            >
              <span className="font-medium text-slate-900">{loc.name}</span>
              <span className="ml-2 text-slate-500">
                {[loc.admin1, loc.country].filter(Boolean).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
