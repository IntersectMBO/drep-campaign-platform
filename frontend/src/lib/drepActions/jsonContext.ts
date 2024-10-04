export const CIP_100 =
  'https://github.com/cardano-foundation/CIPs/blob/master/CIP-0100/README.md#';
export const CIP_108 =
  'https://github.com/cardano-foundation/CIPs/blob/master/CIP-0108/README.md#';
export const CIP_119 =
  'https://github.com/cardano-foundation/CIPs/blob/master/CIP-0119/README.md#';

export function createDREPContext(metadataKeys: string[]) {
  const specialKeys = ['references', 'image'];
  const bodyContext = metadataKeys
    .filter((key) => !specialKeys.includes(key))
    .reduce(
      (acc, key) => {
        acc[key] = `CIP119:${key}`;
        return acc;
      },
      {} as Record<string, any>,
    );
  bodyContext.image = {
    '@id': 'CIP119:image',
    '@context': {
      ImageObject: 'https://schema.org/ImageObject',
    },
  };
  bodyContext.references = {
    '@id': 'CIP119:references',
    '@container': '@set',
    '@context': {
      GovernanceMetadata: 'CIP100:GovernanceMetadataReference',
      Other: 'CIP100:OtherReference',
      label: 'CIP100:reference-label',
      uri: 'CIP100:reference-uri',
      referenceHash: {
        '@id': 'CIP119:referenceHash',
        '@context': {
          hashDigest: 'CIP119:hashDigest',
          hashAlgorithm: 'CIP100:hashAlgorithm',
        },
      },
    },
  };
  return {
    '@language': 'en-us',
    CIP100:
      'https://github.com/cardano-foundation/CIPs/blob/master/CIP-0100/README.md#',
    CIP119: CIP_119,
    hashAlgorithm: 'CIP100:hashAlgorithm',
    body: {
      '@id': 'CIP119:body',
      '@context': bodyContext,
    },
    authors: {
      '@id': 'CIP100:authors',
      '@container': '@set' as const,
      '@context': {
        name: 'http://xmlns.com/foaf/0.1/name',
        witness: {
          '@id': 'CIP100:witness',
          '@context': {
            witnessAlgorithm: 'CIP100:witnessAlgorithm',
            publicKey: 'CIP100:publicKey',
            signature: 'CIP100:signature',
          },
        },
      },
    },
  };
}
