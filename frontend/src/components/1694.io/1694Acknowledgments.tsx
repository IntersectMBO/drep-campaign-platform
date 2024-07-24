import React, { useEffect, useState } from 'react';
import AcknowledgmentSummary from './AcknowledgmentSummary';
import { useScreenDimension } from '@/hooks';

const CIPAcknowledgments = () => {
  const {isMobile} = useScreenDimension();
  return (
    <div className="bg-gradient-to-b from-[#E9EFFF] to-[#FFFFFF] text-black">
      <div className="base_container flex w-full flex-col gap-10 py-10">
        <div className="text-start">
          <p className="text-3xl font-bold text-zinc-800 lg:text-5xl">
            Acknowledgements
          </p>
        </div>
        {!isMobile ? (
          <div className="grid grid-cols-2 gap-20">
            <div className="col-span-1">
              <AcknowledgmentSummary />
            </div>
            <div className="col-span-1 flex flex-col items-center justify-between">
              <div>
                <img src="/img/doublecoin-top.png" alt="" />
              </div>
              <div>
                <img src="/img/doublecoin-bottom.png" alt="" />
              </div>
            </div>
          </div>
        ) : (
          <div className='relative dual-bg'>
            <AcknowledgmentSummary />
          </div>
        )}
      </div>
    </div>
  );
};

export default CIPAcknowledgments;
