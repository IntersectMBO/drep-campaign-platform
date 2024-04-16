import React from "react";

const DRepIntroText = () => {
  return (
    <div className="mt-28 ml-4">
      <div className="font-black text-7xl text-drep-intro-text-color">
        <p>A next step</p>
        <p>in Cardano</p>
        <p>governance:</p>
        <p>Voltaire</p>
      </div>
      <div className="text-lg font-light">
        <p>
          We propose a revision of Cardano's on-chain governance system to
          support the new requirements for Voltaire. The existing specialized
          governance support for protocol parameter updates and MIR certificates
          will be removed, and two new fields will be added to normal
          transaction bodies for:
        </p>
        <ol className="list-decimal ml-10">
            <li>governance actions</li>
            <li>votes</li>
        </ol>
      </div>
    </div>
  );
};

export default DRepIntroText;
