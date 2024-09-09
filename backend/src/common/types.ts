export type StakeKeys = {
  stakeKey: string;
  stakeKeyBech32: string;
} | null;

export type Delegation = {
  drep_raw: string | null;
  drep_view: string | null;
  encode: string | null;
} | null;

export enum MetadataStandard {
  CIP100 = 'CIP100',
}

export enum MetadataValidationStatus {
  URL_NOT_FOUND = 'URL_NOT_FOUND',
  INVALID_JSONLD = 'INVALID_JSONLD',
  INVALID_HASH = 'INVALID_HASH',
  INCORRECT_FORMAT = 'INCORRECT_FORMAT',
}
export enum LoggerMessage {
  METADATA_VALIDATION_ERROR = 'Metadata validation error',
  METADATA_DATA = 'Metadata data',
  CANNOT_GET_METADATA_URL = 'Cannot get metadata from URL',
  PARSED_METADATA_BODY = 'Parsed metadata body',
  CANNOT_PARSE_METADATA_BODY = 'Cannot parse metadata body',
}

export type ValidateMetadataResult = {
  status?: MetadataValidationStatus;
  valid: boolean;
  metadata?: any;
};
export type IPFSResponse = {
  name: string;
  ipfs_hash: string;
  size: number;
  state?: 'queued' | 'pinned' | 'unpinned' | 'failed' | 'gc'; //custom field
};
export type IPFSPinResponse = {
  ipfs_hash: string;
  state: 'queued' | 'pinned' | 'unpinned' | 'failed' | 'gc';
};

/**
 * Represents the response of IPFS pin status.
 * @property {number} time_created - The time the object was created.
 * @property {number} time_pinned - The time the object was pinned.
 * @property {string} ipfs_hash - The IPFS hash of the pinned object.
 * @property {string} size - The size of the pinned object.
 * @property {string} state - The state of the pinned object. Possible values: [queued|pinned|unpinned|failed|gc]
 State of the pinned object, which is queued when we are retriving object. If this is successful the state is changed to pinned or failed if not. The state gc means the pinned item has been garbage collected due to account being over storage quota or after it has been moved to unpinned state by removing the object pin.
 */
export type IPFSPinStatusResponse = {
  time_created: number;
  time_pinned: number;
  ipfs_hash: string;
  size: string;
  state: 'queued' | 'pinned' | 'unpinned' | 'failed' | 'gc';
};
