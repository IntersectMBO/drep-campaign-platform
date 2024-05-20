'use client';
import ViewDraftsButton from '@/components/molecules/ViewDraftsButton';
import NewNoteForm from '@/components/organisms/NewNoteForm';
import UpdateNoteForm from '@/components/organisms/UpdateNoteForm';
import { useDRepContext } from '@/context/drepContext';
import { useCardano } from '@/context/walletContext';
import { getSingleDRep } from '@/services/requests/getSingleDrep';
import React, { useEffect, useState } from 'react';

const page = (params: { params: { noteid: number } }) => {
  const { isEnabled } = useCardano();
  const [initialValues, setInitialValues] = useState(null);
  const { setIsWalletListModalOpen } = useDRepContext();
  //displays or hides modal only if in form page
  useEffect(() => {
    const fetchNoteandCheckLogin = async () => {
      try {
        if (!isEnabled) setIsWalletListModalOpen(true);
        const note = await getSingleDRep(params.params.noteid);
        setInitialValues(note);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNoteandCheckLogin();
    return () => {
      setIsWalletListModalOpen(false);
    };
  }, []);
  return (
    <div className="drep_radial_bg flex items-center justify-center">
      <div className="base_container h-full ">
        <div className="w-full bg-white p-10">
          <div className="flex flex-row items-center justify-between">
            <h2 className="w-[85%] shrink grow basis-0 text-4xl font-bold leading-10">
              Update Note
            </h2>
            {/* <div className="flex items-center justify-center w-[15%] text-base font-medium leading-4 text-center">
              <ViewDraftsButton />
            </div> */}
          </div>
          <UpdateNoteForm
            noteId={params.params.noteid}
            initialValues={initialValues}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
