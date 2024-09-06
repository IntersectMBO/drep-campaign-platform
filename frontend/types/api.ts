export type currentDelegation = {
  drep_raw: string | null;
  drep_view: string | null;
  encode: string | null;
} | null;

export type DRepCExplorerDetails = {
  drep_hash_id: string| null;
  view: string| null;
  delegation_vote_count: string| null;
  stake_address: string| null;
  amount: string| null;
  epoch_no: number| null;
  active_until: number| null;
  deposit: string| null;
  date_of_registration: string| null;
  epoch_of_registration: number| null;
  url: string| null;
  type: string| null;
}| null;

export type Delegator = {
  stakeAddress: string| null;
  delegationEpoch: number| null;
  votingPower: number| null;
};

export type SingleDRep = {
  cexplorerDetails: DRepCExplorerDetails;
  activity: any[];
  delegators: Delegator[];
};
