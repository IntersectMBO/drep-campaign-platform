import React from 'react';

const CIPIntroText = () => {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-start justify-start gap-20">
      <div className="text-start text-4xl lg:text-6xl font-black text-zinc-800">
        <p>CIP 1694 - An On-Chain</p>
        <p>Decentralized Governance</p>
        <p>Mechanism for Voltaire</p>
      </div>
      <div className="lg:pr-40 text-lg font-light text-gray-800 ">
        <hr className="border border-black opacity-50" />
        <p>
          We propose a revision of Cardano's on-chain governance system to
          support the new requirements for Voltaire. The existing specialized
          governance support for protocol parameter updates and MIR certificates
          will be removed, and two new fields will be added to normal
          transaction bodies :
          <span className="font-bold"> governance actions, votes.</span>
        </p>
      </div>
    </div>
  );
};

export default CIPIntroText;
