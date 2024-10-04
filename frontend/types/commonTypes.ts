export interface StakeKeys {
  stakeKey?: string;
  stakeKeyBech32?: string;
}

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [property: string]: JSONValue }
  | JSONValue[];
export enum MetadataStandard {
  CIP100 = 'CIP100',
  CIP119 = 'CIP119',
}

export type DRepMetadata = {
  givenName: string;
  email?: string;
  bio?: string;
  objectives?: string;
  motivations?: string;
  qualifications?: string;
  references: any[];
  image?: {
    contentUrl: string;
    sha256: string;
  };
  paymentAddress?: string;
};
export type MetadataSaveResponse = {
  deletedAt: string;
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  hash: string;
  content: string;
};
export type IPFSResponse = {
  name: string;
  ipfs_hash: string;
  size: number;
};
