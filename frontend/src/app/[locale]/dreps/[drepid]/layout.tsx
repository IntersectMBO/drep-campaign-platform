'use client';
import DRepProfileBar from '@/components/atoms/DrepProfileBar';
import DrepTabGroup from '@/components/atoms/DrepTabGroup';
import { useState } from 'react';
import { Grow, IconButton } from '@mui/material';
import { useCardano } from '@/context/walletContext';
import { useGetSingleDRepQuery } from '@/hooks/useGetSingleDRepQuery';
import { useParams } from 'next/navigation';
import NotFound from './not-found';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { dRepIDBech32 } = useCardano();
  const [isOpen, setIsOpen] = useState(false);
  const { drepid } = useParams();
  const { dRep, isDRepLoading, fetchError } = useGetSingleDRepQuery(drepid);

  const currentUserIsDrep = dRep?.drep_id && dRep?.view == dRepIDBech32;

  if (!isDRepLoading && fetchError?.response?.status === 404) {
    return (
      <Grow in={true}>
        <div>
          <NotFound />
        </div>
      </Grow>
    );
  }
  return (
    <div className="flex">
      {/* If current user is a drep, the drawer will be available for use */}
      {currentUserIsDrep && (
        <DRepProfileBar isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      <div className="base_container w-full">
        <div className="flex h-full w-full flex-col">
          <div
            className={`sticky top-0 z-10 flex items-center justify-start bg-blue-50 ${currentUserIsDrep && 'justify-between'}`}
          >
            {currentUserIsDrep && (
              <div className="shrink-0 lg:w-[30%]">
                <IconButton
                  data-testid="close-drawer-button"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                >
                  <img
                    width={'50%'}
                    className="shrink-0"
                    src={'/svgs/menu.svg'}
                  />
                </IconButton>
              </div>
            )}
            <div
              className={
                currentUserIsDrep
                  ? 'overflow-auto lg:w-[70%]'
                  : 'lg:w:[70%] w-full lg:flex lg:justify-end'
              }
            >
              <div
                className={`flex justify-start ${!currentUserIsDrep && 'lg:w-[70%]'}`}
              >
                <DrepTabGroup drepId={drepid as string} />
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
