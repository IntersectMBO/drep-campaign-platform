import Link from 'next/link';
import React from 'react';

const MetadataUpdateTimelineCard = () => {
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl bg-blue-800 p-3 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-nowrap rounded-full bg-black px-2 py-1 text-white">
          <img src="/svgs/reload.svg" alt="" className="h-5 w-5" />
          <p className="text-xs">Metadata Update</p>
        </div>
        <div>
          <p className="text-xs">Epoch 343</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <p className="text-lg font-bold"> Updates in metadata information</p>
        <div>
          <p className="font-bold">Previous Value</p>
          <div className="flex items-center gap-1">
            <p className="text-sm font-bold">Key</p>
            <p className="text-sm font-bold">Value</p>
          </div>
        </div>
        <div>
          <p className="font-bold">Updated New Value</p>
          <div className="flex items-center gap-1">
            <p className="text-sm font-bold">Key</p>
            <p className="text-sm font-bold">Value</p>
          </div>
        </div>
      </div>
      <div>
        <Link href="#">
          <p className="text-xs font-extralight">See transaction</p>
        </Link>
      </div>
    </div>
  );
};

export default MetadataUpdateTimelineCard;
