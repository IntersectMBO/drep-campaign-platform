import { generateKeyPairSync, KeyObject, sign } from 'crypto';
import { CborTag, Encoder } from '@stricahq/cbors';
import { bech32 } from 'bech32';
import { blake2b } from 'blakejs';
import { DataSignature } from '../src/auth/data-signature';

/**
 * Test-only Ed25519 key that produces CIP-30 style data signatures
 * (COSE_Sign1 + COSE_Key), the way a wallet's `signData` does.
 */
export class TestWalletKey {
  readonly publicKey: Buffer;
  private readonly privateKey: KeyObject;

  constructor() {
    const { publicKey, privateKey } = generateKeyPairSync('ed25519');
    this.privateKey = privateKey;
    this.publicKey = Buffer.from(
      publicKey.export({ format: 'jwk' }).x as string,
      'base64url',
    );
  }

  get keyHash(): Buffer {
    return Buffer.from(blake2b(this.publicKey, undefined, 28));
  }

  stakeAddress(networkId = 1): string {
    const header = Buffer.from([0xe0 | networkId]);
    return bech32.encode(
      networkId === 1 ? 'stake' : 'stake_test',
      bech32.toWords(Buffer.concat([header, this.keyHash])),
    );
  }

  drepId(): string {
    return bech32.encode('drep', bech32.toWords(this.keyHash));
  }

  coseKey(overrides: Array<[number, any]> = []): string {
    const key = new Map<number, any>([
      [1, 1],
      [3, -8],
      [-1, 6],
      [-2, this.publicKey],
    ]);
    overrides.forEach(([label, value]) => key.set(label, value));
    return Encoder.encode(key).toString('hex');
  }

  signData(
    payload: string | Buffer,
    options: {
      address?: Buffer;
      alg?: number;
      hashed?: boolean;
      tagged?: boolean;
    } = {},
  ): DataSignature {
    const { address = Buffer.alloc(0), alg = -8, hashed, tagged } = options;
    const protectedBytes = Encoder.encode(
      new Map<any, any>([
        [1, alg],
        ['address', address],
      ]),
    );
    const payloadBytes = Buffer.isBuffer(payload)
      ? payload
      : Buffer.from(payload, 'utf8');
    const sigStructure = Encoder.encode([
      'Signature1',
      protectedBytes,
      Buffer.alloc(0),
      payloadBytes,
    ]);
    const signature = sign(null, sigStructure, this.privateKey);
    const coseSign1 = [
      protectedBytes,
      new Map([['hashed', !!hashed]]),
      payloadBytes,
      signature,
    ];
    return {
      signature: Encoder.encode(
        tagged ? new CborTag(coseSign1, 18) : coseSign1,
      ).toString('hex'),
      key: this.coseKey(),
    };
  }
}
