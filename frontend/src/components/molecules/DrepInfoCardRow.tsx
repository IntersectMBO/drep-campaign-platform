import React from 'react';
import DrepInfoCard from '../atoms/DrepInfoCard';

const DrepInfoCardRow = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 items-center justify-center gap-4 text-zinc-100">
            <DrepInfoCard
                img={'/img/regImg.png'}
                title={'Registration'}
                action={
                    {
                        label: 'Register on-chain',
                        href: '#'
                    }
                }
                description={
                    'Like stake pools, DRep registers their intention on chain via DRep Certificates.'
                }
            />

            <DrepInfoCard
                img={'/img/delegImg.png'}
                title={'Delegation'}
                action={
                    {
                        label: 'Create your campaign',
                        href: '/dreps/workflow/profile/new'
                    }
                }
                description={
                    'Just like staking a pool, Ada holders can delegate their stake to a DRep with Transaction.'
                }
            />

            <DrepInfoCard
                img={'/img/credImg.png'}
                title={'Voting Power'}
                action={
                    {
                        label: 'See Your Profile',
                        href: '#'
                    }
                }
                description={
                    'DRep voting power will be the total value of staked Ada delegated to the DRep.'
                }
            />

            <DrepInfoCard
                img={'/img/statusImg.png'}
                title={'Status'}
                action={
                    {
                        label: 'Go To Your Timeline',
                        href: '#'
                    }
                }
                description={
                    'Registered DReps will need to vote regularly to still be considered active.'
                }
            />
        </div>
    );
};

export default DrepInfoCardRow;
