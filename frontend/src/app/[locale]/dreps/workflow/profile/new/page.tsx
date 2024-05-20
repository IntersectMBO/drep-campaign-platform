'use client';
import SetupProgressBar from '@/components/atoms/SetupProgressBar';
import NewProfile from '@/components/organisms/NewProfile';
import {useDRepContext} from '@/context/drepContext';
import {useCardano} from '@/context/walletContext';
import React, {useEffect} from 'react';

const page = () => {
  const { setIsWalletListModalOpen , setStep1Status} = useDRepContext();
  const { isEnabled } = useCardano();
  useEffect(() => {
    if (!isEnabled) setIsWalletListModalOpen(true);
    setStep1Status('active');
  }, []);
  return (
    <div className="form_container bg-white px-2 lg:px-5 py-10">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        {/* <SetupProgressBar /> */}
        <NewProfile />
      </div>
    </div>
  );
};

export default page;
