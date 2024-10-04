export const CONFIGURED_NETWORK_ID = Number(process.env.NEXT_PUBLIC_NETWORK_ID);
export const CONFIGURED_NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_MODE || '';
export const urls = {
  baseServerUrl: process.env.NEXT_PUBLIC_BASE_URL_API || '',
  govToolUrl: process.env.NEXT_PUBLIC_BASE_URL_GOVTOOL || '',
  cexplorerUrl: process.env.NEXT_PUBLIC_BASE_URL_EXPLORER || '',
  ipfsGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || '',
  adaStatusUrl: process.env.NEXT_PUBLIC_BASE_URL_ADASTATUS || ''
};
