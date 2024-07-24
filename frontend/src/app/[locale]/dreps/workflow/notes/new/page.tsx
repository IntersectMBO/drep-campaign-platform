'use client';
import ViewDraftsButton from '@/components/molecules/ViewDraftsButton';
import NewNoteForm from '@/components/organisms/NewNoteForm';
import { useDRepContext } from '@/context/drepContext';
import { useCardano } from '@/context/walletContext';
import React, { useEffect } from 'react';

const page = () => {
  const { isEnabled } = useCardano();
  const { setIsWalletListModalOpen } = useDRepContext();
  //displays or hides modal only if in form page
  useEffect(() => {
    const checkLogin = () => {
      if (!isEnabled) setIsWalletListModalOpen(true);
    };
    checkLogin();
    return () => {
      setIsWalletListModalOpen(false);
    };
  }, []);
  return (
    <div className="drep_radial_bg flex items-center justify-center">
      <div className="form_container h-full ">
        <div className="w-full bg-white p-10">
          <div className="flex flex-row items-center justify-between">
            <h2 className="w-[85%] shrink grow basis-0 text-4xl font-bold leading-10">
              New Note
            </h2>
            <div className="flex w-[15%] items-center justify-center text-center text-base font-medium leading-4">
              <ViewDraftsButton />
            </div>
          </div>
          <NewNoteForm />
        </div>
      </div>
    </div>
  );
};

export default page;
