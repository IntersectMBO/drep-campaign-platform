import * as jsonld from 'jsonld';
import { CIP_100, CIP_119 } from './drepActions/jsonContext';
import { JSONValue } from '../../types/commonTypes';

/**
 * Generates a JSON-LD document by compacting the given body and context.
 *
 * @template T - The type of the body.
 * @template C - The type of the context.
 * @param {T} body - The body of the JSON-LD document.
 * @param {C} context - The context of the JSON-LD document.
 * @returns {Promise<any>} - A promise that resolves to the compacted JSON-LD document.
 */
export const generateJsonld = async <
  T extends Record<string, JSONValue>,
  C extends jsonld.ContextDefinition,
>(
  body: T,
  context: C,
  bodyCip: string = CIP_119,
  vkeys: { vkey: string; signature: string },
) => {
  const doc = {
    [`${bodyCip}body`]: body,
    [`${CIP_100}hashAlgorithm`]: 'blake2b-256',
    [`${CIP_100}authors`]: [
      {
        [`${CIP_100}witness`]: {
          [`${CIP_100}witnessAlgorithm`]: 'Ed25519',
          [`${CIP_100}publicKey`]: vkeys.vkey,
          [`${CIP_100}signature`]: vkeys.signature,
        },
      },
    ],
  };

  const json = await jsonld.compact(doc, context);
  //for image
  if (body[`${CIP_119}image`]) {
    json['body']['image'] = {
      '@type': 'ImageObject',
      contentUrl: body[`${CIP_119}image`]['contentUrl'],
      sha256: body[`${CIP_119}image`]['sha256'],
    };
  }
  return json;
};
