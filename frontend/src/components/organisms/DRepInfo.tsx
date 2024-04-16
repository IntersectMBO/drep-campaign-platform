import React from "react";
import DrepInfoCardRow from "../molecules/DrepInfoCardRow";
import BecomeADrepCard from "../molecules/BecomeADrepCard";

const DRepInfo = () => {
  return (
    <div
      className="w-fullScale rounded-t-3xl overflow-hidden
      bg-[url(/img/drepsBg.png)] bg-opacity-20 bg-cover bg-center mt-5 shadow-lg"
    >
      {/* Inner div for img background */}
      <div className="drep_bg w-fullScale h-[100%] flex flex-col gap-10" >
        <div className="ml-10 mt-10 font-bold text-pale-white text-7xl">
          <p>Delegated Representatives</p>
          <p>(DReps)</p>
        </div>
        <DrepInfoCardRow />
        <div className="flex items-center justify-center">
          <hr className="text-pale-white w-[900px] border" />
        </div>
        <BecomeADrepCard/>
      </div>
    </div>
  );
};

export default DRepInfo;
