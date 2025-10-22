import React from 'react';
import VoterWalletStats from './VoterWalletStats';
import VoterDelegationHistory from './VoterDelegationHistory';
import { useParams } from 'next/navigation';
import { useVoterDataByIdentityQuery } from '@/hooks/useGetVoterDataByIdentityQuery';
import { Address } from '@emurgo/cardano-serialization-lib-asmjs';
const convertAddressToBech32 = (address: string) => {
  if (
    address.includes('addr') ||
    address.includes('stake') ||
    address.includes('drep')
  ) {
    return address;
  } else return Address.from_bytes(Buffer.from(address, 'hex')).to_bech32();
};
const VoterDashboard = () => {
  const { voterId } = useParams();
  const { voterData, isVoterDataLoading } = useVoterDataByIdentityQuery(
    convertAddressToBech32(voterId as string),
  );
  return (
    <div className="flex min-h-screen w-full flex-col gap-3 py-4 bg-white">
      <VoterWalletStats
        voterData={voterData}
        isVoterDataLoading={isVoterDataLoading}
      />
      <hr className="border-t border-green-400 w-[95%] self-center" />
      <VoterDelegationHistory
        voterData={voterData}
        isVoterDataLoading={isVoterDataLoading}
       />
    </div>
  );
};

export default VoterDashboard;
