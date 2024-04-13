"use client";
import React, {useState} from "react";
import {useCardano} from "@/context/walletContext";
import WalletConnectButton from "@/components/molecules/WalletConnectButton";
import {ChooseWalletModal} from "@/components/organisms";
import {WalletInfoCard} from "@/components/molecules";

const Header = () => {
    const {isEnabled} = useCardano();
    const [isModalOpen, setisModalOpen] = useState(false);

    const connectWallet = () => {
        try {
            setisModalOpen(true);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="flex flex-row items-center justify-between bg-[#f8f8f8]">
            <div className="ml-10 p-3">
                <img src="/sancho-black.svg" alt="Sancho logo"/>
            </div>

            <div className="flex m-5 items-center text-sm font-bold text-nowrap gap-4 md:mr-20 lg:mr-25">
                <a href="#" className="text-orange-600">Home</a>
                <a href="#">DReps</a>
                <a href="#">Become a DRep</a>
                <a href="#">Notes</a>
                <a href="#">Ecosystem</a>
                <a href="#" className="text-blue-800 font-bold">Create profile</a>
                <div>
                    {!isEnabled ? (
                        <WalletConnectButton handleClick={connectWallet}/>
                    ) : (
                        <WalletInfoCard/>
                    )}
                    {isModalOpen && (
                        <ChooseWalletModal handleClose={() => setisModalOpen(false)}/>
                    )}
                </div>
                <div>
                    <img src="/bell.svg" alt="Bell logo"/>
                </div>
            </div>
        </div>
    );
};

export default Header;
