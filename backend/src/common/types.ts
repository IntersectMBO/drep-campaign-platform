export type StakeKeys = {
  stakeKey: string;
  stakeKeyBech32: string;
} | null;

export type Delegation = {
  drep_raw: string | null;
  drep_view: string | null;
  encode: string | null;
} | null;
