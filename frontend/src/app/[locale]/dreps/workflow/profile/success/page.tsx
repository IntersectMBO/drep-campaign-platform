'use client';
import Button from '@/components/atoms/Button';
import { useDRepContext } from '@/context/drepContext';
import { useCardano } from '@/context/walletContext';
import Link from 'next/link';
import React from 'react';

const page = () => {
  const { setStep1Status } = useDRepContext();
  const { dRepIDBech32 } = useCardano();
  return (
    <div className="flex min-h-screen flex-col gap-6 px-10">
      <h1 className="text-4xl lg:text-6xl">Profile Created Successfully!</h1>
      <div className="text-center">
        <p>Your DRep Profile has been created successfully</p>
      </div>
      <div className="mt-6 flex items-center justify-center gap-5 lg:flex-row">
        <Button
          variant="outlined"
          bgColor="transparent"
          handleClick={() => setStep1Status('update')}
        >
          <Link className="w-fit" href="/dreps/workflow/profile/update/step1">
            Make Changes
          </Link>
        </Button>
        <Button>
          <Link className="w-fit" href={`/dreps/${dRepIDBech32}`}>
            View your Profile
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default page;
