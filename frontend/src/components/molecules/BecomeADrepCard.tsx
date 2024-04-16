import { useCardano } from "@/context/walletContext";
import React, { useState } from "react";
import WalletConnectButton from "./WalletConnectButton";

const BecomeADrepCard = () => {
  const { isEnabled } = useCardano();
  return (
    <div className="grid grid-cols-2 mx-20 text-pale-white mb-10">
      <div className="col-span-1 flex-col items-center justify-center">
        <div className="font-black text-5xl mb-3">
          <p>How can I</p>
          <p> become a DRep</p>
        </div>

        <p>
          In order to participate in governance, a stake credential must be
          delegated to a DRep. Ada holders will generally delegate their voting
          rights to a registered DRep that will vote on their behalf.
        </p>
        <ul className="list-disc ml-4 mb-2">
          <li>You might need this</li>
          <li>also this</li>
          <li>and this</li>
          <li>maybe this</li>
          <li>and definitely this</li>
        </ul>
        <div>{!isEnabled && <WalletConnectButton />}</div>
      </div>
      <div className="col-span-1 flex items-center justify-end mr-5">
        <img
          src="/img/becomeDrepImg.png"
          alt="Handholdingcardanocoin"
          width={"210px"}
        />
      </div>
    </div>
  );
};

export default BecomeADrepCard;
