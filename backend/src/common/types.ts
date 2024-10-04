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

/**
 * Represents the response object for a Blockfrost block.
 *
 * @remarks
 * This type contains information about a specific block in the Blockfrost blockchain.
 *
 *
 * @remarks {height} - block number
 */
export type BlockfrostBlockRes = {
  time: number;
  height: number; // block number
  hash: string;
  slot: number;
  epoch: number;
  epoch_slot: number;
  slot_leader: string;
  size: number;
  tx_count: number;
  output: string;
  fees: string;
  block_vrf: string;
  op_cert: string;
  op_cert_counter: string;
  previous_block: string;
  next_block: null | string;
  confirmations: number;
};
export type NodeBlockRes = {
  hash: string;
  epoch_no: number;
  slot_no: string;
  epoch_slot_no: number;
  block_no: number;
  previous_id: string;
  slot_leader: string;
  size: number;
  time: string;
  tx_count: string;
  proto_major: number;
  proto_minor: number;
  vrf_key: string;
  op_cert: string;
  op_cert_counter: string;
};
export interface VoterData {
  address: string;
  total_stake: number;
  drep_id: string;
  stake_address: string;
  delegationHistory: any[];
  isDelegated: boolean;
}
export type DRepRegistrationData = {
  drep_hash_id: number;
  reg_tx_hash: string;
  date_of_registration: Date;
  epoch_of_registration: number;
};
export type EpochActivityResponse = {
  start_time: Date;
  end_time: Date;
  no: number;
  type: string;
};
export type VotingActivityHistory = {
  view: string;
  gov_action_proposal_id: string;
  prop_inception: Date;
  type: string;
  description: string;
  voting_anchor_id: string;
  vote: string;
  metadata: any;
  time_voted: Date;
  proposal_epoch: number;
  voting_epoch: number;
  url: string;
};
export type DRepDelegatorsHistoryRecord = {
  stake_address: string;
  target_drep: string;
  current_drep: string;
  previous_drep: string;
  timestamp: string;
  delegation_epoch: number;
  tx_hash: string;
  type: 'delegation';
  total_stake: string; 
  added_power: boolean;
};

export type DRepDelegatorsHistoryResponse = DRepDelegatorsHistoryRecord[];

export type VoterNoteResponseRecord = {
  deletedAt?: Date;
  id: number;
  createdAt: Date;
  note_updatedAt: Date;
  title: string;
  tag?: string;
  content: string;
  visibility: string;
  drepId?: number;
  authorId?: number;
  comments?: any[];
  reactions?: any[];
  type: 'note';
  timestamp: string;
};
export type VoterNoteResponse = VoterNoteResponseRecord[];
export type ClaimedProfile = {
  type: 'claimed_profile';
  drep_id: string;
  claimingId: string;
  claimedDRepId: string;
};

export interface DRepTimelineParams {
  drep: any;
  drepVoterId: string;
  stakeKeyBech32?: string;
  delegation?: Delegation;
  beforeDate?: number;
  tillDate?: number;
  filterValues?: string[];
}
export interface TimelineEntry {
  type: string;
  timestamp: string | Date;
  [key: string]: any;
}  
export interface TimelineFilters {
  includeVotingActivity: boolean;
  includeDelegations: boolean;
  includeNotes: boolean;
  includeClaimedProfile: boolean;
  includeRegistration: boolean;
}



