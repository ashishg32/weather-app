'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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

export function LocationSearch() {
  const router = useRouter();
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term), 250);
    return () => clearTimeout(id);
  }, [term]);

  const { data, loading } = useQuery<{ searchLocations: Location[] }>(SEARCH, {
    variables: { query: debounced },
    skip: debounced.trim().length < 2,
  });

  const results = data?.searchLocations ?? [];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function select(loc: Location) {
    setOpen(false);
    setTerm(loc.name);
    const label = [loc.name, loc.admin1, loc.country].filter(Boolean).join(', ');
    router.push(`/?lat=${loc.latitude}&lon=${loc.longitude}&name=${encodeURIComponent(label)}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = results[active];
      if (chosen) select(chosen);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search for a city…"
        role="combobox"
        aria-expanded={open}
        aria-controls="location-listbox"
        aria-activedescendant={open && results[active] ? `loc-${results[active].id}` : undefined}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
      />

      {open && debounced.trim().length >= 2 && (
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
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => select(loc)}
              className={`cursor-pointer px-4 py-3 text-sm ${
                i === active ? 'bg-slate-100' : ''
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