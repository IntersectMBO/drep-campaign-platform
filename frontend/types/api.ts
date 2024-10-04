export type currentDelegation = {
  drep_raw: string | null;
  drep_view: string | null;
  encode: string | null;
} | null;

export type DRepCExplorerDetails = {
  drep_hash_id: string | null;
  view: string | null;
  delegation_vote_count: string | null;
  stake_address: string | null;
  amount: string | null;
  epoch_no: number | null;
  active_until: number | null;
  deposit: string | null;
  date_of_registration: string | null;
  epoch_of_registration: number | null;
  url: string | null;
  type: string | null;
} | null;

export type Delegator = {
  stakeAddress: string | null;
  delegationEpoch: number | null;
  votingPower: number | null;
};

export type SingleDRep = {
  drep_deletedAt?: string | null;
  drep_id?: number | null;
  drep_createdAt?: string | null;
  drep_updatedAt?: string | null;
  drep_name?: string | null;
  drep_bio?: string | null;
  drep_metadata?: string | null;
  drep_social?: string | null;
  drep_platform_statement?: string | null;
  drep_expertise?: string | null;
  drep_perspective?: string | null;
  attachment_deletedAt?: string | null;
  attachment_id?: number | null;
  attachment_createdAt?: string | null;
  attachment_updatedAt?: string | null;
  attachment_name?: string | null;
  attachment_url?: string | null;
  attachment_parententity?: string | null;
  attachment_parentid?: number | null;
  attachment_attachmentType?: string | null;
  attachment_noteId?: number | null;
  attachment_drepId?: number | null;
  attachment_commentId?: number | null;
  signature_id?: number | null;
  signature_drepVoterId?: string | null;
  signature_drepStakeKey?: string | null;
  signature_drepSignature?: string | null;
  signature_drepSignatureKey?: string | null;
  signature_drepId?: number | null;
  cexplorerDetails: DRepCExplorerDetails;
  activity?: any[];
  delegators?: Delegator[];
};

export type DRepStats = {
  delegators: number;
  votes: number;
  votingPower: number;
};

export type DelegationData = {
  stake_address: string;
  target_drep: string;
  current_drep: string;
  previous_drep: string | null;
  timestamp: string;
  delegation_epoch: number;
  tx_hash: string;
  type: string;
  total_stake: string;
  added_power: boolean;
};