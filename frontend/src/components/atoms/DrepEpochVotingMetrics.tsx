import React from 'react';

const DrepEpochVotingMetrics = () => {
  return (
    <div className="flex flex-row items-center justify-between px-6 py-4">
      <div className="flex flex-col gap-3">
        <div>
          <p>Total Live Vote in the System</p>
          <p className="font-bold">₳ 434,673,973,634</p>
        </div>
        <div>
          <p>Total Elegible voters</p>
          <p className="font-bold">₳ 434,673,973,634</p>
        </div>
        <div>
          <p>Epoch of registration</p>
          <p className="font-bold">373</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <p>Total Registered Dreps</p>
          <p className="font-bold">₳ 434,673,973,634</p>
        </div>
        <div>
          <p>Total items currently up for vote</p>
          <p className="font-bold">₳ 434,673,973,634</p>
        </div>
        <div>
          <p>Current epoch</p>
          <p className="font-bold">383</p>
        </div>
      </div>
    </div>
  );
};

export default DrepEpochVotingMetrics;
