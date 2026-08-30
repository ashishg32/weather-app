'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export function makeClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: '/api/graphql' }),
    cache: new InMemoryCache(),
  });
}