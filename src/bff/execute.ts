import 'server-only';
import { graphql } from 'graphql';
import { schema } from './schema';

export async function executeServerQuery<T>(
  source: string,
  variableValues?: Record<string, unknown>,
): Promise<T> {
  const result = await graphql({ schema, source, variableValues });
  if (result.errors?.length) {
    throw new Error(result.errors.map((e) => e.message).join('; '));
  }
  // graphql-js returns null-prototype objects; React can't serialize those
  // across the Server → Client boundary. Round-trip to plain objects.
  return JSON.parse(JSON.stringify(result.data)) as T;
}