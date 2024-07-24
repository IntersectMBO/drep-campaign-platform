import React from 'react';
import DrepInfoCardRow from '../molecules/DrepInfoCardRow';
import BecomeADrepCard from '../molecules/BecomeADrepCard';

const DRepInfo = () => {
  return (
    <div className="mt-5 w-full overflow-hidden rounded-t-3xl bg-opacity-20 bg-[url(/img/drepsBg.png)] bg-cover bg-center shadow-lg">
      {/* Inner div for img background */}
      <div className="drep_bg flex h-full w-full flex-col gap-10">
        <div className="base_container py-16">
          <div className="flex flex-col gap-16">
            <div className="max-w-lg lg:max-w-3xl xl:w-full items-center justify-center gap-2 pt-14 text-4xl font-bold text-violet-50 md:text-6xl lg:text-7xl">
              <p>Delegated Representatives</p>
              <p>(DReps)</p>
            </div>
            <DrepInfoCardRow />
            {/*<div className="flex items-center justify-center">*/}
            {/*  <hr className="w-[68.75rem] border text-violet-50" />*/}
            {/*</div>*/}
            {/* <BecomeADrepCard /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DRepInfo;
