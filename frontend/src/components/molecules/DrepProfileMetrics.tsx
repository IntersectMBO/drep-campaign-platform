import React from 'react';
import DrepDelegatorslist from '../atoms/DrepDelegatorsList';

const DrepProfileMetrics = ({drepMetrics}:{drepMetrics: any}) => {
  return (
    <div className='bg-white p-5 min-h-screen'>
      <DrepDelegatorslist delegators={drepMetrics?.delegators} />
    </div>
  );
};

export default DrepProfileMetrics;