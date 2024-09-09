import React from 'react';
import DrepDelegatorsList from '../atoms/DrepDelegatorsList';

const DrepProfileMetrics = ({drepMetrics}:{drepMetrics: any}) => {
  return (
    <div className='bg-white p-5 min-h-screen'>
      <DrepDelegatorsList delegators={drepMetrics?.delegators} />
    </div>
  );
};

export default DrepProfileMetrics;