import { Encoder } from '@stricahq/cbors';
import { bech32 } from 'bech32';
import {
  drepIdFromKeyHash,
  drepIdVariants,
  drepKeyHashFromId,
  isSignedByDRep,
  parseStakeAddress,
  verifyDataSignature,
  verifyStakeKeySignature,
} from './data-signature';
import { TestWalletKey } from '../../test/test-wallet';

const MESSAGE = 'Log in to the DRep campaign platform.\n\nNonce: abc';

describe('verifyDataSignature', () => {
  const wallet = new TestWalletKey();

  it('returns the signing key hash for a valid signature', () => {
    const signed = wallet.signData(MESSAGE);

    expect(verifyDataSignature(signed, MESSAGE)).toBe(
      wallet.keyHash.toString('hex'),
    );
  });

  it('accepts a tagged COSE_Sign1 structure', () => {
    const signed = wallet.signData(MESSAGE, { tagged: true });

    expect(verifyDataSignature(signed, MESSAGE)).toBe(
      wallet.keyHash.toString('hex'),
    );
  });

  it('accepts any payload when none is expected', () => {
    const signed = wallet.signData('Verify DRep drep1example');

    expect(verifyDataSignature(signed)).toBe(wallet.keyHash.toString('hex'));
  });

  it('rejects a signature over a different payload', () => {
    const signed = wallet.signData('another message');

    expect(verifyDataSignature(signed, MESSAGE)).toBeNull();
  });

  it('rejects a signature paired with another key', () => {
    const signed = wallet.signData(MESSAGE);
    const other = new TestWalletKey();

    expect(
      verifyDataSignature({ ...signed, key: other.coseKey() }, MESSAGE),
    ).toBeNull();
  });

  it('rejects a modified signature', () => {
    const signed = wallet.signData(MESSAGE);
    const bytes = Buffer.from(signed.signature, 'hex');
    bytes[bytes.length - 1] ^= 0x01;

    expect(
      verifyDataSignature(
        { ...signed, signature: bytes.toString('hex') },
        MESSAGE,
      ),
    ).toBeNull();
  });

  it('rejects hashed payloads', () => {
    const signed = wallet.signData(MESSAGE, { hashed: true });

    expect(verifyDataSignature(signed, MESSAGE)).toBeNull();
  });

  it('rejects algorithms other than EdDSA', () => {
    const signed = wallet.signData(MESSAGE, { alg: -7 });

    expect(verifyDataSignature(signed, MESSAGE)).toBeNull();
  });

  it('rejects keys that are not Ed25519', () => {
    const signed = wallet.signData(MESSAGE);

    expect(
      verifyDataSignature(
        { ...signed, key: wallet.coseKey([[-1, 4]]) },
        MESSAGE,
      ),
    ).toBeNull();
  });

  it('rejects malformed input', () => {
    const signed = wallet.signData(MESSAGE);

    expect(verifyDataSignature({ ...signed, signature: 'zz' }, MESSAGE)).toBe(
      null,
    );
    expect(verifyDataSignature({ ...signed, key: '' }, MESSAGE)).toBeNull();
    expect(
      verifyDataSignature(
        {
          ...signed,
          signature: Encoder.encode(['not', 'cose']).toString('hex'),
        },
        MESSAGE,
      ),
    ).toBeNull();
    expect(verifyDataSignature(undefined, MESSAGE)).toBeNull();
  });
});

describe('verifyStakeKeySignature', () => {
  const wallet = new TestWalletKey();

  it('accepts a signature by the stake key of the address', () => {
    const signed = wallet.signData(MESSAGE);

    expect(
      verifyStakeKeySignature(signed, MESSAGE, wallet.stakeAddress()),
    ).toBe(true);
    expect(
      verifyStakeKeySignature(signed, MESSAGE, wallet.stakeAddress(0)),
    ).toBe(true);
  });

  it('rejects a stake address of another key', () => {
    const signed = wallet.signData(MESSAGE);

    expect(
      verifyStakeKeySignature(
        signed,
        MESSAGE,
        new TestWalletKey().stakeAddress(),
      ),
    ).toBe(false);
  });

  it('rejects a signature over another message', () => {
    const signed = wallet.signData('another message');

    expect(
      verifyStakeKeySignature(signed, MESSAGE, wallet.stakeAddress()),
    ).toBe(false);
  });
});

describe('parseStakeAddress', () => {
  const wallet = new TestWalletKey();

  it('reads key-based reward addresses', () => {
    expect(parseStakeAddress(wallet.stakeAddress())).toEqual({
      networkId: 1,
      keyHash: wallet.keyHash.toString('hex'),
    });
    expect(parseStakeAddress(wallet.stakeAddress(0))).toEqual({
      networkId: 0,
      keyHash: wallet.keyHash.toString('hex'),
    });
  });

  it('rejects script reward addresses', () => {
    const scriptAddress = bech32.encode(
      'stake',
      bech32.toWords(Buffer.concat([Buffer.from([0xf1]), wallet.keyHash])),
    );

    expect(parseStakeAddress(scriptAddress)).toBeNull();
  });

  it('rejects a prefix that does not match the network', () => {
    const mismatched = bech32.encode(
      'stake_test',
      bech32.toWords(Buffer.concat([Buffer.from([0xe1]), wallet.keyHash])),
    );

    expect(parseStakeAddress(mismatched)).toBeNull();
    expect(parseStakeAddress('not-an-address')).toBeNull();
  });
});

describe('DRep ids', () => {
  const wallet = new TestWalletKey();
  const hash = wallet.keyHash.toString('hex');
  const cip129 = bech32.encode(
    'drep',
    bech32.toWords(Buffer.concat([Buffer.from([0x22]), wallet.keyHash])),
  );

  it('derives the CIP-105 id from a key hash', () => {
    expect(drepIdFromKeyHash(hash)).toBe(wallet.drepId());
    expect(drepKeyHashFromId(wallet.drepId())).toBe(hash);
  });

  it('reads CIP-129 key-based ids', () => {
    expect(drepKeyHashFromId(cip129)).toBe(hash);
    expect(drepIdVariants(wallet.drepId())).toEqual([wallet.drepId(), cip129]);
    expect(drepIdVariants(cip129)).toEqual([wallet.drepId(), cip129]);
  });

  it('does not resolve script-based DRep ids', () => {
    const cip129Script = bech32.encode(
      'drep',
      bech32.toWords(Buffer.concat([Buffer.from([0x23]), wallet.keyHash])),
    );
    const cip105Script = bech32.encode(
      'drep_script',
      bech32.toWords(wallet.keyHash),
    );

    expect(drepKeyHashFromId(cip129Script)).toBeNull();
    expect(drepKeyHashFromId(cip105Script)).toBeNull();
    expect(drepIdVariants(cip105Script)).toEqual([]);
  });

  it('checks that a signature was made with the DRep key', () => {
    const signed = wallet.signData(`Verify DRep ${wallet.drepId()}`);

    expect(isSignedByDRep(signed, wallet.drepId())).toBe(true);
    expect(isSignedByDRep(signed, cip129)).toBe(true);
    expect(isSignedByDRep(signed, new TestWalletKey().drepId())).toBe(false);
    expect(isSignedByDRep(signed, undefined)).toBe(false);
  });
});
