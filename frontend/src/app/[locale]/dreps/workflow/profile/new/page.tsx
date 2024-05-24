'use client';
import SetupProgressBar from '@/components/atoms/SetupProgressBar';
import NewProfile from '@/components/organisms/NewProfile';
import { useDRepContext } from '@/context/drepContext';
import { useCardano } from '@/context/walletContext';
import React, { useEffect } from 'react';

const page = () => {
  const { setIsWalletListModalOpen, setStep1Status } = useDRepContext();
  const { isEnabled } = useCardano();
  useEffect(() => {
    if (!isEnabled) setIsWalletListModalOpen(true);
    setStep1Status('active');
  }, []);
  return <NewProfile />;
};

export default page;
