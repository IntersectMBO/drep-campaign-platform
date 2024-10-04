import React from 'react';
import DrepInfoCard from '../atoms/DrepInfoCard';
import { urls } from '@/constants';

const DrepInfoCardRow = () => {
  return (
    <div className="grid grid-cols-1 items-center justify-center gap-4 text-zinc-100 sm:grid-cols-2 xl:grid-cols-4">
      <DrepInfoCard
        img={'/img/regImg.png'}
        title={'Registration'}
        action={{
          label: 'Register on-chain',
          href: `${urls.govToolUrl}/register_drep`,
          target: '_blank',
        }}
        description={
          'Like stake pools, DRep registers their intention on chain via DRep Certificates.'
        }
      />

      <DrepInfoCard
        img={'/img/delegImg.png'}
        title={'Delegation'}
        action={{
          label: 'Create your campaign',
          href: '/dreps/workflow/profile/new',
        }}
        description={
          'Just like staking a pool, Ada holders can delegate their stake to a DRep with Transaction.'
        }
      />

      <DrepInfoCard
        img={'/img/credImg.png'}
        title={'Voting Power'}
        action={{
          label: 'See Your Profile',
          href: '#',
        }}
        description={
          'DRep voting power will be the total value of staked Ada delegated to the DRep.'
        }
      />

      <DrepInfoCard
        img={'/img/statusImg.png'}
        title={'Status'}
        action={{
          label: 'Go To Your Timeline',
          href: '#',
        }}
        description={
          'Registered DReps will need to vote regularly to still be considered active.'
        }
      />
    </div>
  );
};

export default DrepInfoCardRow;
