import React, { useState, useEffect } from 'react';
import { formatAsCurrency, lovelaceToAda, shortenAddress } from '@/lib';
import ArrowRightIcon from './svgs/ArrowRightIcon';
import Link from 'next/link';
import { urls } from '@/constants';
import { DelegationData } from '../../../types/api';

const DrepDelegatorCard = ({ item }: { item: DelegationData }) => {
  const [addressLength, setAddressLength] = useState(10);
  const [drepLength, setDRepLength] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && window.innerWidth < 1280) {
        setDRepLength(3);
        setAddressLength(6);
      } else {
        setDRepLength(6);
        setAddressLength(10);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatTotalStake = (stake: string, addedPower: boolean) => {
    const sign = addedPower ? '+' : '-';
    const ada = lovelaceToAda(Number(stake));
    return `${sign}${formatAsCurrency(ada)}`;
  };

  const isPreviousTargetDRep = item.previous_drep === item.target_drep;
  const isCurrentTargetDRep = item.current_drep === item.target_drep;

  return (
    <div className="flex w-full flex-col gap-2 text-center">
      <p className="text-sm font-bold">
        {formatTotalStake(item?.total_stake, item?.added_power)} ₳
      </p>
      <p className="text-base">
        {shortenAddress(item?.stake_address, addressLength)}
      </p>
      <div className="flex w-full items-center justify-center">
        {!!item.previous_drep ? (
          isPreviousTargetDRep ? (
            <p className="text-sm font-bold uppercase text-primary-300">
              {shortenAddress(item.previous_drep, drepLength)}
            </p>
          ) : (
            <Link
              href={`/dreps/${item.previous_drep}`}
              className="text-sm font-bold uppercase text-yellow-500"
            >
              {shortenAddress(item.previous_drep, drepLength)}
            </Link>
          )
        ) : (
          <p className="text-sm font-bold uppercase text-yellow-500">null</p>
        )}
        <ArrowRightIcon color="black" />
        {isCurrentTargetDRep ? (
          <p className="text-sm font-bold uppercase text-primary-300">
            {shortenAddress(item?.current_drep, drepLength)}
          </p>
        ) : (
          <Link
            href={`/dreps/${item.current_drep}`}
            className="text-sm font-bold uppercase text-yellow-500"
          >
            {shortenAddress(item?.current_drep, drepLength)}
          </Link>
        )}
      </div>
      <Link href={`${urls.cexplorerUrl}/tx/${item?.tx_hash}`} target="_blank">
        <div className="flex items-center justify-center gap-2 text-nowrap text-gray-500 hover:cursor-pointer hover:text-gray-800">
          <img src="/svgs/external-link.svg" alt="" />
          <p>View Tx</p>
        </div>
      </Link>
    </div>
  );
};

export default DrepDelegatorCard;
