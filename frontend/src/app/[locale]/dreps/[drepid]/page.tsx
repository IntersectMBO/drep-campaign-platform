'use client';
import DrepProfileCard from '@/components/atoms/DrepProfileCard';
import { Suspense } from 'react';
import DrepTimeline from '@/components/molecules/DrepTimeline';
import { useGetSingleDRepQuery } from '@/hooks/useGetSingleDRepQuery';
import { useParams } from 'next/navigation';
import DrepClaimProfileCard from '@/components/atoms/DrepClaimProfileCard';

const page = () => {
  const { drepid } = useParams();
  const { dRep, isDRepLoading } = useGetSingleDRepQuery(drepid);

  return (
      <div className="flex flex-col lg:flex-row">
        <div className="lg:sticky lg:top-10 lg:w-[30%] lg:self-start lg:!scroll-smooth">
          {dRep?.drep_id ? (
            <DrepProfileCard drep={dRep} state={isDRepLoading} />
          ) : (
            <DrepClaimProfileCard drep={dRep} state={isDRepLoading} />
          )}
        </div>
        <div className="lg:w-[70%]">
          <Suspense>
            <DrepTimeline drep={dRep} />
          </Suspense>
        </div>
      </div>
  );
};

export default page;
