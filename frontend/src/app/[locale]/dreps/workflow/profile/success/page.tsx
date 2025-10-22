'use client';
import Button from '@/components/atoms/Button';
import TimerCountDown from '@/components/atoms/TimerCountDown';
import { urls } from '@/constants';
import { useDRepContext } from '@/context/drepContext';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
import { useCardano } from '@/context/walletContext';
import { checkTxExists } from '@/services/requests/checkTxExists';
import { Grow } from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import React, { useEffect, useState } from 'react';

const page = () => {
  const [isTxSynced, setIsTxSynced] = useState(false);
  const { setStep1Status } = useDRepContext();
  const { dRepIDBech32 } = useCardano();
  const { addErrorAlert } = useGlobalNotifications();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const txHash = params.get('hash');

  useEffect(() => {
    if (!txHash) return;

    const checkTxInterval = setInterval(() => {
      let isTxAvailable = checkTxExists(txHash);

      console.log(isTxAvailable);
      if (!!isTxAvailable) {
        setIsTxSynced(true);
        clearInterval(checkTxInterval);
      }
    }, 10 * 1000);

    return () => clearInterval(checkTxInterval);
  }, []);

  useEffect(() => {
    if (!txHash) return;

    const checkTxInterval = setInterval(async () => {
      try {
        const isTxAvailable = await checkTxExists(txHash);
        console.log(isTxAvailable);
        if (isTxAvailable) {
          setIsTxSynced(true);
          clearInterval(checkTxInterval);
        }
      } catch (error) {
        addErrorAlert('Error checking transaction existence');
      }
    }, 10 * 1000);

    return () => clearInterval(checkTxInterval);
  }, [txHash]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-10">
      <h1 className="text-4xl lg:text-6xl">Profile Created Successfully!</h1>
      {!isTxSynced && (
        <div className="flex flex-col gap-6 text-center">
          <p>
            Your metadata update is being processed and may take a few minutes
            to propagate
          </p>
          <div>
            <TimerCountDown minutes={3} />
          </div>
        </div>
      )}
      {!!txHash && (
        <Link href={`${urls.cexplorerUrl}/tx/${txHash}`} target="_blank">
          <div className="flex flex-col items-center justify-center gap-2 text-wrap text-gray-600 hover:cursor-pointer hover:text-gray-800">
            <p className="underline">{txHash}</p>
            <div className='flex items-center gap-2'>
              <img src="/svgs/external-link.svg" alt="" />
              <p>View Tx</p>
            </div>
          </div>
        </Link>
      )}
      {isTxSynced && (
        <Grow in={isTxSynced} style={{ transformOrigin: 'top center' }}>
          <div className="flex items-center gap-2">
            <p className="text-xl font-medium text-green-600">
              New metadata successfully propagated
            </p>
            <img src="/svgs/success.svg" alt="success svg" />
          </div>
        </Grow>
      )}
      <div className="flex items-center justify-center gap-5 lg:flex-row">
        <Button
          variant="outlined"
          bgcolor="transparent"
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
