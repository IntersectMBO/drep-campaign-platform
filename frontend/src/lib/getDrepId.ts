import { Buffer } from 'buffer';
import * as blake from 'blakejs';
import { bech32 } from 'bech32';
import { CardanoApiWallet } from '@/models/wallet';
import { StakeCredential, Ed25519KeyHash } from '@emurgo/cardano-serialization-lib-asmjs';

export const formHexToBech32 = (dRepID?: string) => {
  if (!dRepID) return;
  const words = bech32.toWords(Buffer.from(dRepID, 'hex'));
  const dRepIDBech32 = bech32.encode('drep', words);
  return dRepIDBech32;
};

// New function to convert from bech32 to hex
export const fromBech32ToHex = (dRepIDBech32: string): string => {
  try {
    const decoded = bech32.decode(dRepIDBech32);
    const data = bech32.fromWords(decoded.words);
    return Buffer.from(data).toString('hex');
  } catch (error) {
    console.error('Error decoding bech32:', error);
    return '';
  }
};
export const getPubDRepID = async (walletApi: CardanoApiWallet) => {
  try {
    // From wallet get pub DRep key
    const raw = await walletApi.cip95.getPubDRepKey();
    //console.log('pubDrepId', raw)
    const dRepKey = raw;
    // From wallet's DRep key hash to get DRep ID
    const dRepKeyBytes = Buffer.from(dRepKey, 'hex');
    const dRepID = blake.blake2bHex(dRepKeyBytes, undefined, 28);
    console.log(dRepID)
    // into bech32
    const dRepIDBech32 = formHexToBech32(dRepID);
    console.log('dRepIDBech32', dRepIDBech32)
    const myDrepId='drep155hlv9cpsq9e3fax0yp50zdp3q4pw2vy3pt376xfpuquxn6z8sv'
    console.log('backtracking')
    // Convert bech32 DRep ID back to hex (pubDRepID)
    const pubDRepIDHex = fromBech32ToHex(myDrepId);
    console.log('Recovered pubDRepID (hex):', pubDRepIDHex);
    const dRepKeyHash = Ed25519KeyHash.from_hex(pubDRepIDHex);
    const dRepCred = StakeCredential.from_keyhash(dRepKeyHash);
    console.log(dRepKeyHash.to_bech32('drep'))
    console.log(dRepCred.to_json())
    return {
      dRepKey,
      dRepID,
      dRepIDBech32,
    };
  } catch (err) {
    console.error(err);
    return {
      dRepKey: undefined,
      dRepID: undefined,
      dRepIDBech32: undefined,
    };
  }
};
