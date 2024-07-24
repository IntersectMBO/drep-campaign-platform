import React from 'react';
import StatusChip from './StatusChip';

const DrepProfileWalletStats = () => {
  return (
    <div className='flex items-center justify-between px-3'>
      <div>
        <p className='text-sm'>Current wallet balance for wallet:</p>
        <p className='text-xl'>4rfuysad8828iswisikkskad8u8276pñsñsakdja</p>
        <p className='text-4xl'>₳ 2,263,47</p>
      </div>
      <div>
        <p className='font-bold text-lg'>Status</p>
        <StatusChip status='Active' />
      </div>
    </div>
  );
};

export default DrepProfileWalletStats;