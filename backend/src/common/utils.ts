import * as jsonld from 'jsonld';
export const canonizeJSON = async (json: Record<string, unknown>) => {
  const canonized = await jsonld.canonize(json);
  return canonized;
};
