import React from 'react';
import DrepDelegatorsList from '../atoms/DrepDelegatorsList';

const DrepProfileMetrics = ({voterId}:{voterId: string}) => {
  return (
    <div className='bg-white p-5'>
      <DrepDelegatorsList voterId={voterId} />
    </div>
  );
};

export default DrepProfileMetrics;