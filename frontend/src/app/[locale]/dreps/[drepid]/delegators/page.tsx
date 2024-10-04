'use client';
import DrepProfileMetrics from '@/components/molecules/DrepProfileMetrics';
import { useParams } from 'next/navigation';

const page = () => {
  const { drepid } = useParams();
  return (
    <div className="min-h-screen">
      <DrepProfileMetrics voterId={String(drepid)} />
    </div>
  );
};

export default page;
