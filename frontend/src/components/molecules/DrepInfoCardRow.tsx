import React, { useEffect, useState } from 'react';
import DrepInfoCard from '../atoms/DrepInfoCard';
import { urls } from '@/constants';
import { useDRepContext } from '@/context/drepContext';
import { useCardano } from '@/context/walletContext';
import { useGetAdaHolderCurrentDelegationQuery } from '@/hooks/useGetAdaHolderCurrentDelegationQuery';
import { useGetSingleDRepViaVoterIdQuery } from '@/hooks/useGetSingleDRepViaVoterIdQuery';

const DrepInfoCardRow = () => {
  const {setIsWalletListModalOpen} = useDRepContext()
  const {isEnabled, stakeKey} = useCardano();
  const currentDelegation = useGetAdaHolderCurrentDelegationQuery(stakeKey)
  const { DRep } = useGetSingleDRepViaVoterIdQuery(
    currentDelegation?.currentDelegation?.drep_view
  );
  
  return (
    <div className="grid grid-cols-1 items-center justify-center gap-4 text-zinc-100 sm:grid-cols-2 xl:grid-cols-4">
      <DrepInfoCard
        img={'/img/regImg.png'}
        title={'Registration'}
        action={{
          label: isEnabled ? 'Register on-chain' : "Connect Wallet",
          href: isEnabled ? `${urls.govToolUrl}/register_drep` : '',
          target: isEnabled ? '_blank' : undefined,
        }}
        clicked={isEnabled ? undefined : ()=>{setIsWalletListModalOpen(true)}}
        description={
          'Like stake pools, DRep registers their intention on chain via DRep Certificates.'
        }
      />

      <DrepInfoCard
        img={'/img/delegImg.png'}
        title={'Delegation'}
        action={{
          label: isEnabled ? 'Create your campaign' :"Connect Wallet",
          href: isEnabled ? '/dreps/workflow/profile/new' : '',
        }}
        clicked={isEnabled ? undefined : ()=>{setIsWalletListModalOpen(true)}}
        description={
          'Just like staking a pool, Ada holders can delegate their stake to a DRep with Transaction.'
        }
      />

      <DrepInfoCard
        img={'/img/credImg.png'}
        title={'Voting Power'}
        action={{
          label: isEnabled ? 'See Your Profile' : "Connect Wallet",
          href: isEnabled ?`/dreps/${currentDelegation?.currentDelegation?.drep_view}` : ''
        }}
        clicked={isEnabled ? undefined : ()=>{setIsWalletListModalOpen(true)}}
        description={
          'DRep voting power will be the total value of staked Ada delegated to the DRep.'
        }
      />

      <DrepInfoCard
        img={'/img/statusImg.png'}
        title={'Status'}
        action={{
          label: isEnabled ? 'Go To Your Timeline' : "Connect Wallet",
          href: isEnabled ?`/dreps/${currentDelegation?.currentDelegation?.drep_view}` : ''
        }}
        description={
          'Registered DReps will need to vote regularly to still be considered active.'
        }
        clicked={isEnabled ? undefined : ()=>{setIsWalletListModalOpen(true)}}
      />
    </div>
  );
};

export default DrepInfoCardRow;
