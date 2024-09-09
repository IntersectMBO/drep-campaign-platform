import { useGetDRepStatsQuery } from '@/hooks/useGetDRepStatsQuery';
import { formattedAda } from '@/lib';
import { Skeleton } from '@mui/material';
import React from 'react';

export const ProfileClaimedChip = ({ claimedAddress, dateOfClaim }) => {
  const { DRepStats, isDRepStatsLoading } =
    useGetDRepStatsQuery(claimedAddress);

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl bg-yellow-500 px-3 py-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex max-w-fit items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-sm text-white">
          <img src="/svgs/user-circle-filled-yellow.svg" alt="" />
          <p>Profile Claimed</p>
        </div>
        <p>{new Date(dateOfClaim).toDateString()}</p>
      </div>
      {isDRepStatsLoading && (
        <Skeleton className="w-full" height={60} animation={'wave'} />
      )}{' '}
      {!isDRepStatsLoading && !DRepStats && (
        <div className="h-full w-full text-center font-bold">
          No DRep stats available!
        </div>
      )}
      {!isDRepStatsLoading && !!DRepStats && (
        <div className="rounded bg-gray-800 px-2 py-2">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-px bg-white/5 md:grid-cols-4">
              <div className="flex h-full w-full flex-col justify-between gap-3 bg-gray-800 px-2">
                <p className="text-xs font-medium leading-3 text-gray-400">
                  Delegators
                </p>
                <span className="overflow-hidden text-sm font-semibold tracking-tight text-white">
                  {DRepStats.delegators}
                </span>
              </div>
              <div className="flex h-full w-full flex-col justify-between  gap-3 bg-gray-800 px-4">
                <p className="text-xs font-medium leading-3 text-gray-400">
                  Active power
                </p>
                <span className="overflow-hidden text-sm font-semibold tracking-tight text-white">
                  ₳ {formattedAda(DRepStats.votingPower, 3)}
                </span>
              </div>
              <div className="flex h-full w-full flex-col justify-between gap-3 bg-gray-800 px-2 pt-2 md:px-4 md:pt-0">
                <p className="text-xs font-medium leading-3 text-gray-400">
                  Governance actions
                </p>
                <span className="overflow-hidden text-sm font-semibold tracking-tight text-white">
                  -
                </span>
              </div>
              <div className="flex h-full w-full flex-col justify-between  gap-3 bg-gray-800 px-4 pt-2 md:pt-0">
                <p className="text-xs font-medium leading-3 text-gray-400">
                  Votes
                </p>
                <span className="overflow-hidden text-sm font-semibold tracking-tight text-white">
                  {DRepStats.votes}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
