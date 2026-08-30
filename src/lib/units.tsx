'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Unit = 'c' | 'f';

const UnitContext = createContext<{ unit: Unit; setUnit: (u: Unit) => void }>({
  unit: 'c',
  setUnit: () => {},
});

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<Unit>('c');

  useEffect(() => {
    const saved = window.localStorage.getItem('unit');
    if (saved === 'c' || saved === 'f') setUnit(saved);
  }, []);

  function update(u: Unit) {
    setUnit(u);
    window.localStorage.setItem('unit', u);
  }

  return <UnitContext.Provider value={{ unit, setUnit: update }}>{children}</UnitContext.Provider>;
}

export const useUnits = () => useContext(UnitContext);

export function formatTemp(celsius: number, unit: Unit): string {
  const value = unit === 'f' ? celsius * 9 / 5 + 32 : celsius;
  return `${Math.round(value)}°`;
}