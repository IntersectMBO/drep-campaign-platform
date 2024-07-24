import React from 'react';

const DRepIntroText = () => {
  return (
    <div>
      <div className="text-5xl lg:text-6xl 2xl:text-7xl font-black text-zinc-800">
        <p>Cardano DRep</p>
        <p>Campaign</p>
        <p>Platform:</p>
        {/*<p>Voltaire</p>*/}
      </div>
      <div className="text-lg font-light text-gray-800 flex flex-col gap-2 pr-16">
        <p>
          is a community built platform for facilitating connecting, collaborating,
          and campaigning between DReps and the Cardano community.
          DReps amplify your voice and drive impactful decisions.
        </p>
        <p className="font-bold">
          If you hold Ada, jump in, pick a DRep, stay informed and keep the conversation going!
        </p>
      </div>
    </div>
  );
};

export default DRepIntroText;
