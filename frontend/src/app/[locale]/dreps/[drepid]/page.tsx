'use client';
import DRepProfileBar from '@/components/atoms/DrepProfileBar';
import DrepProfileCard from '@/components/atoms/DrepProfileCard';
import DrepTabGroup from '@/components/atoms/DrepTabGroup';
import { Suspense, useState } from 'react';
import { IconButton } from '@mui/material';
import DrepTimeline from '@/components/molecules/DrepTimeline';
import DrepProfileMetrics from '@/components/molecules/DrepProfileMetrics';
import { useParams } from 'next/navigation';
import DrepClaimProfileCard from '@/components/atoms/DrepClaimProfileCard';
import { useCardano } from '@/context/walletContext';
import { useGetSingleDRepQuery } from '@/hooks/useGetSingleDRepQuery';

const page = () => {
  const [currentTab, setCurrentTab] = useState('profile');
  const { latestEpoch, dRepIDBech32 } = useCardano();
  const [isOpen, setIsOpen] = useState(false);
  const { drepid } = useParams();
  const { dRep, isDRepLoading } = useGetSingleDRepQuery(drepid);

  return (
    <div className="flex">
      {/* If current user is a drep, the drawer will be available for use */}
      {dRep?.drep_id && dRep?.cexplorerDetails?.view == dRepIDBech32 && (
        <DRepProfileBar isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      <div className="base_container w-full">
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center justify-start">
            <div className="w-[30%]">
              {dRep?.drep_id &&
                dRep?.cexplorerDetails?.view == dRepIDBech32 && (
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
                )}
            </div>
            <div className="w-[70%]">
              <DrepTabGroup setActiveTab={setCurrentTab} />
            </div>
          </div>
          {currentTab === 'profile' ? (
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-[30%]">
                {dRep?.drep_id ? (
                  <DrepProfileCard drep={dRep} state={isDRepLoading} />
                ) : (
                  <DrepClaimProfileCard drep={dRep} state={isDRepLoading} />
                )}
              </div>
              <div className="lg:w-[70%]">
                <Suspense>
                <DrepTimeline
                  drepId={dRep?.drep_id || dRep?.cexplorerDetails?.view}
                  latestEpoch={latestEpoch}
                  cexplorerDetails={dRep?.cexplorerDetails}
                  activity={dRep?.activity}
                />
                </Suspense>
              </div>
            </div>
          ) : (
            <DrepProfileMetrics drepMetrics={dRep} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
