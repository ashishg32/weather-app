import { createYoga } from 'graphql-yoga';
import { schema } from '@/bff/schema';
import type { NextRequest } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  graphiql: !isProd,
  fetchAPI: { Request, Response },
});

// Wrap the handler to match Next.js 16 route handler signature
export async function GET(request: NextRequest) {
  return handleRequest(request, {});
}

export async function POST(request: NextRequest) {
  return handleRequest(request, {});
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request, {});
}