import { createPublicKey, verify } from 'crypto';
import { CborTag, Decoder, Encoder } from '@stricahq/cbors';
import { bech32 } from 'bech32';
import { blake2b } from 'blakejs';

/**
 * Wallet data signature as returned by CIP-30 `signData`: a COSE_Sign1
 * structure and the COSE_Key of the signing key, both hex-encoded CBOR.
 */
export type DataSignature = {
  signature: string;
  key: string;
};

// COSE labels and values (RFC 8152) used by CIP-30 / CIP-8
const COSE_HEADER_ALG = 1;
const COSE_ALG_EDDSA = -8;
const COSE_SIGN1_TAG = 18;
const COSE_KEY_KTY = 1;
const COSE_KEY_ALG = 3;
const COSE_KEY_CRV = -1;
const COSE_KEY_X = -2;
const COSE_KTY_OKP = 1;
const COSE_CRV_ED25519 = 6;

const ED25519_PUBLIC_KEY_LENGTH = 32;
const ED25519_SIGNATURE_LENGTH = 64;
const KEY_HASH_LENGTH = 28;

// Reward address header nibbles (CIP-19)
const REWARD_ADDRESS_KEY_HASH = 0xe;
// CIP-129 header byte for a DRep key hash credential
const CIP129_DREP_KEY_HASH = 0x22;

const MAINNET_ID = 1;

const decodeHex = (value: string) => {
  if (typeof value !== 'string' || !/^([0-9a-fA-F]{2})+$/.test(value)) {
    throw new Error('Expected hex-encoded bytes');
  }
  return Buffer.from(value, 'hex');
};

const isMap = (value: unknown): value is Map<any, any> => value instanceof Map;

/**
 * Reads the Ed25519 public key from a COSE_Key, checking that it describes
 * an Ed25519 key.
 */
export const readCoseKey = (coseKey: string): Buffer => {
  const { value } = Decoder.decode(decodeHex(coseKey));
  if (!isMap(value)) throw new Error('COSE_Key is not a map');
  if (value.get(COSE_KEY_KTY) !== COSE_KTY_OKP) {
    throw new Error('COSE_Key is not an OKP key');
  }
  if (value.get(COSE_KEY_CRV) !== COSE_CRV_ED25519) {
    throw new Error('COSE_Key is not an Ed25519 key');
  }
  const alg = value.get(COSE_KEY_ALG);
  if (alg !== undefined && alg !== COSE_ALG_EDDSA) {
    throw new Error('COSE_Key algorithm is not EdDSA');
  }
  const publicKey = value.get(COSE_KEY_X);
  if (
    !Buffer.isBuffer(publicKey) ||
    publicKey.length !== ED25519_PUBLIC_KEY_LENGTH
  ) {
    throw new Error('COSE_Key has no Ed25519 public key');
  }
  return publicKey;
};

export const keyHash = (publicKey: Buffer) =>
  Buffer.from(blake2b(publicKey, undefined, KEY_HASH_LENGTH)).toString('hex');

/**
 * Verifies that `dataSignature` is a valid COSE_Sign1 signature made with
 * the key in its COSE_Key. When `expectedPayload` is given, the signed
 * payload must be exactly that text.
 *
 * Returns the blake2b-224 hash of the signing key, or null when the
 * signature is malformed, signs a different payload or does not verify.
 */
export const verifyDataSignature = (
  dataSignature: DataSignature,
  expectedPayload?: string,
): string | null => {
  try {
    const publicKey = readCoseKey(dataSignature?.key);

    let { value: coseSign1 } = Decoder.decode(
      decodeHex(dataSignature?.signature),
    );
    if (coseSign1 instanceof CborTag) {
      if (coseSign1.tag !== COSE_SIGN1_TAG) return null;
      coseSign1 = coseSign1.value;
    }
    if (!Array.isArray(coseSign1) || coseSign1.length !== 4) return null;
    const [protectedBytes, unprotected, payload, signature] = coseSign1;

    if (!Buffer.isBuffer(protectedBytes) || protectedBytes.length === 0) {
      return null;
    }
    const protectedHeader = Decoder.decode(protectedBytes).value;
    if (
      !isMap(protectedHeader) ||
      protectedHeader.get(COSE_HEADER_ALG) !== COSE_ALG_EDDSA
    ) {
      return null;
    }
    // Only plain payloads are accepted, not CIP-8 hashed ones
    if (!isMap(unprotected) || unprotected.get('hashed') === true) {
      return null;
    }
    if (!Buffer.isBuffer(payload)) return null;
    if (
      expectedPayload !== undefined &&
      !payload.equals(Buffer.from(expectedPayload, 'utf8'))
    ) {
      return null;
    }
    if (
      !Buffer.isBuffer(signature) ||
      signature.length !== ED25519_SIGNATURE_LENGTH
    ) {
      return null;
    }

    // Sig_structure for COSE_Sign1 with the protected header as received
    const sigStructure = Encoder.encode([
      'Signature1',
      protectedBytes,
      Buffer.alloc(0),
      payload,
    ]);
    const verifyingKey = createPublicKey({
      key: {
        kty: 'OKP',
        crv: 'Ed25519',
        x: publicKey.toString('base64url'),
      },
      format: 'jwk',
    });
    if (!verify(null, sigStructure, verifyingKey, signature)) return null;

    return keyHash(publicKey);
  } catch {
    return null;
  }
};

/**
 * Decodes a bech32 reward address and returns its network id and key hash.
 * Script-based reward addresses are not supported and return null.
 */
export const parseStakeAddress = (
  stakeAddress: string,
): { networkId: number; keyHash: string } | null => {
  try {
    const { prefix, words } = bech32.decode(stakeAddress);
    const bytes = Buffer.from(bech32.fromWords(words));
    if (bytes.length !== KEY_HASH_LENGTH + 1) return null;
    const header = bytes[0];
    if (header >> 4 !== REWARD_ADDRESS_KEY_HASH) return null;
    const networkId = header & 0x0f;
    const expectedPrefix = networkId === MAINNET_ID ? 'stake' : 'stake_test';
    if (prefix !== expectedPrefix) return null;
    return { networkId, keyHash: bytes.subarray(1).toString('hex') };
  } catch {
    return null;
  }
};

/**
 * Verifies a data signature made with the stake key of `stakeAddress` over
 * `expectedPayload`.
 */
export const verifyStakeKeySignature = (
  dataSignature: DataSignature,
  expectedPayload: string,
  stakeAddress: string,
): boolean => {
  const address = parseStakeAddress(stakeAddress);
  if (!address) return false;
  return (
    verifyDataSignature(dataSignature, expectedPayload) === address.keyHash
  );
};

/** CIP-105 DRep id (`drep1...`) of a DRep key hash, as used by the app. */
export const drepIdFromKeyHash = (drepKeyHash: string) =>
  bech32.encode('drep', bech32.toWords(Buffer.from(drepKeyHash, 'hex')));

/**
 * Key hash of a key-based DRep id, in CIP-105 (28 bytes) or CIP-129
 * (header byte 0x22) form. Script-based DRep ids return null.
 */
export const drepKeyHashFromId = (drepId: string): string | null => {
  try {
    const { prefix, words } = bech32.decode(drepId);
    if (prefix !== 'drep') return null;
    const bytes = Buffer.from(bech32.fromWords(words));
    if (bytes.length === KEY_HASH_LENGTH) return bytes.toString('hex');
    if (
      bytes.length === KEY_HASH_LENGTH + 1 &&
      bytes[0] === CIP129_DREP_KEY_HASH
    ) {
      return bytes.subarray(1).toString('hex');
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Both spellings (CIP-105 and CIP-129) of a key-based DRep id, for matching
 * stored ids that may use either.
 */
export const drepIdVariants = (drepId: string): string[] => {
  const drepKeyHash = drepKeyHashFromId(drepId);
  if (!drepKeyHash) return [];
  const hash = Buffer.from(drepKeyHash, 'hex');
  return [
    bech32.encode('drep', bech32.toWords(hash)),
    bech32.encode(
      'drep',
      bech32.toWords(
        Buffer.concat([Buffer.from([CIP129_DREP_KEY_HASH]), hash]),
      ),
    ),
  ];
};

/**
 * Whether `dataSignature` was made with the key of the key-based DRep
 * `drepId`. Any signed payload is accepted; this is used for the signatures
 * shown on a DRep profile, not for logging in.
 */
export const isSignedByDRep = (
  dataSignature: DataSignature,
  drepId?: string,
): boolean => {
  if (!drepId) return false;
  const signerKeyHash = verifyDataSignature(dataSignature);
  return !!signerKeyHash && signerKeyHash === drepKeyHashFromId(drepId);
};
