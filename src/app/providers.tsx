'use client';

import { ApolloProvider } from '@apollo/client/react';
import { useMemo, type ReactNode } from 'react';
import { makeClient } from '@/lib/apollo';
import { UnitProvider } from '@/lib/units';

export function Providers({ children }: { children: ReactNode }) {
  const client = useMemo(makeClient, []);
  return (
    <ApolloProvider client={client}>
      <UnitProvider>{children}</UnitProvider>
    </ApolloProvider>
  );
}