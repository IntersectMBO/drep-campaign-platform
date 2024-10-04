'use client';
import Loading from '@/app/[locale]/loading';
import DrepProfileMetrics from '@/components/molecules/DrepProfileMetrics';
import { useGetSingleDRepQuery } from '@/hooks/useGetSingleDRepQuery';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

const DelegatorsPage = () => {
  const { drepIdd } = useParams();
  const { dRep } = useGetSingleDRepQuery(drepIdd);

  return (
    <Suspense fallback={<Loading />}>
      <DrepProfileMetrics drepMetrics={dRep} />;
    </Suspense>
  );
};

export default DelegatorsPage;
