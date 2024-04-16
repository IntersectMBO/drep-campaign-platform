"use client";
import React from "react";
import { useCardano } from "@/context/walletContext";
import WalletConnectButton from "@/components/molecules/WalletConnectButton";
import { WalletInfoCard } from "@/components/molecules";
import Link from "next/link";
import { useDRepContext } from "@/context/drepContext";

const Header = () => {
  const { isEnabled } = useCardano();
  const { activeTab, setActiveTab } = useDRepContext();
  return (
    <div className="flex flex-row items-center justify-between bg-top-nav-bg-color">
      <div className="ml-20 p-3">
        <img src="/sancho-black.svg" alt="Sancho logo" />
      </div>
      <div className="flex m-5 items-center text-sm font-bold  text-nowrap gap-6 md:mr-20 lg:mr-25">
        <Link
          href="/dreps"
          onClick={()=>setActiveTab('/dreps')}
          className={activeTab === "/dreps" ? "text-active" : ""}
        >
          What are DReps
        </Link>
        <Link
          href="/dreps/list"
          onClick={()=>setActiveTab('/dreps/list')}
          className={activeTab === "/dreps/list" ? "text-active" : ""}
        >
          DRep List
        </Link>
        {/*<Link href="#">Become a DRep</Link>*/}
        <Link href="#">Notes</Link>
        <Link href="#">Ecosystem</Link>
        {/*<Link href="#" className="text-blue-800 font-bold">*/}
        {/*  Create profile*/}
        {/*</Link>*/}
        <div>{!isEnabled ? <WalletConnectButton /> : <WalletInfoCard />}</div>
        <div className="cursor-pointer">
          <img src="/bell.svg" alt="Notifs" />
        </div>
      </div>
    </div>
  );
};

export default Header;
