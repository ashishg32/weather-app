import { createYoga } from 'graphql-yoga';
import { schema } from '@/bff/schema';

const isProd = process.env.NODE_ENV === 'production';

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  graphiql: !isProd,
  fetchAPI: { Request, Response },
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };