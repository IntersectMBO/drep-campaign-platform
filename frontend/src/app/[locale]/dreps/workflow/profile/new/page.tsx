'use client';
import SetupProgressBar from '@/components/atoms/SetupProgressBar';
import NewProfile from '@/components/organisms/NewProfile';
import { useDRepContext } from '@/context/drepContext';
import { useCardano } from '@/context/walletContext';
import { getSingleDRepViaVoterId } from '@/services/requests/getSingleDrepViaVoterId';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const page = () => {
  const { setIsWalletListModalOpen, setStep1Status, setNewDrepId } =
    useDRepContext();
  const { isEnabled, dRepIDBech32 } = useCardano();
  const router = useRouter();
  useEffect(() => {
    if (!isEnabled) {
      setIsWalletListModalOpen(true);
    } else if (dRepIDBech32) {
      const checkIfExistingDRep = async () => {
        try {
          const drep = await getSingleDRepViaVoterId(dRepIDBech32);
          if (drep?.drep_id) {
            setNewDrepId(drep.drep_id);
            setStep1Status('update');
            router.push(`/dreps/workflow/profile/update/step1`);
          } else setStep1Status('active');
        } catch (error) {
          if (
            error.response?.status === 404 &&
            error.response?.data?.message === 'Drep not found!'
          ) {
            setStep1Status('active');
          }
        }
      };
      checkIfExistingDRep();
    }
  }, [isEnabled, dRepIDBech32]);
  return <NewProfile />;
};

export default page;
