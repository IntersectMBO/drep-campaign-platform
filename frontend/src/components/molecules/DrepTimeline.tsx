'use client';
import React, { useCallback, useEffect, useState } from 'react';
import DrepTimelineWaterfall from './DrepTimelineWaterfall';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';

import Button from '../atoms/Button';
import { useCardano } from '@/context/walletContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSingleDRep } from '@/services/requests/getSingleDrep';
import { getSingleDRepViaVoterId } from '@/services/requests/getSingleDrepViaVoterId';
const ProfileClaimedChip = ({ claimedAddress }) => {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-yellow-500 px-3 py-2 ">
      <div className="flex flex-row items-center justify-between">
        <div className="flex max-w-fit items-center gap-2 rounded-full bg-black px-3 py-1 text-sm text-white">
          <img src="/svgs/user-circle-filled-yellow.svg" alt="" />
          <p>Profile Claimed</p>
        </div>
        <p>{new Date().toDateString()}</p>
      </div>
      <p className="overflow-x-scroll text-nowrap">
        Profile claimed by: {claimedAddress}
      </p>
    </div>
  );
};

const DrepTimeline = ({
  drepId,
  cexplorerDetails,
  activity,
}: {
  drepId: string;
  latestEpoch: number;
  cexplorerDetails: any;
  activity: any[];
}) => {
  const [searchText, setSearchText] = useState('');
  const [allActivities, setAllActivities] = useState(activity || []);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const [endTime, setEndTime] = useState(() => Date.now());
  const [startTime, setStartTime] = useState(
    () => endTime - 30 * 24 * 60 * 60 * 1000,
  );// 30 days for now
  const searchParams = useSearchParams();
  const { dRepIDBech32 } = useCardano();
  const updateURL = (startTime?: number, endTime?: number) => {
    const params = new URLSearchParams(searchParams);
    if (startTime) {
      params.set('startTime', startTime.toString());
    }
    if (endTime) {
      params.set('endTime', endTime.toString());
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  useEffect(() => {
    if (activity) {
      setAllActivities((prevActivities) => {
        const uniqueActivitiesMap = new Map(
          [...prevActivities, ...activity].map((activity) => [
            activity.timestamp,
            activity,
          ]),
        );
        return Array.from(uniqueActivitiesMap.values()).sort(
          (a, b) => b.timestamp - a.timestamp,
        );
      });
      setHasMore(activity.length > 0);
    }
  }, [activity]);

  const updateDominantActivity = () => {
    updateURL(startTime, endTime);
  };

  const fetchMoreData = useCallback(async () => {
    if (allActivities && allActivities.length > 0) {
      const oldestActivityTimestamp = Math.min(
        ...allActivities.map((a) => new Date(a.timestamp).getTime()),
      );
      const newEndTime = oldestActivityTimestamp;
      const newStartTime = newEndTime - 30 * 24 * 60 * 60 * 1000; // Fetch 30 more days
      let drep;
      drepId.includes('drep')
        ? (drep = await getSingleDRepViaVoterId(
            drepId,
            null,
            newEndTime,
            newStartTime,
          ))
        : (drep = await getSingleDRep(
            Number(drepId),
            null,
            newEndTime,
            newStartTime,
          ));
      if (drep.activity && drep.activity.length > 0) {
        setAllActivities((prevActivities) => {
          const uniqueActivitiesMap = new Map(
            [...prevActivities, ...drep.activity].map((activity) => [
              activity.timestamp,
              activity,
            ]),
          );
          return Array.from(uniqueActivitiesMap.values()).sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          );
        });
        setHasMore(drep.activity.length > 0);
        // Update time states
        setEndTime(newEndTime);
        setStartTime(newStartTime);
      } else {
        setHasMore(false);
      }
    }
  }, [drepId, allActivities]);
  return (
    <div className="flex h-full w-full flex-col gap-5 bg-white px-5 py-3">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p className="w-full text-2xl font-bold sm:w-auto lg:text-3xl">
          Timeline
        </p>
        {/* <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          handleSort={() => {}}
          handleFilter={() => {}}
        /> */}
      </div>
      {cexplorerDetails?.view == dRepIDBech32 && (
        <Button className="flex w-fit items-center">
          <Link href={`/dreps/workflow/notes/new`}>Add a note</Link>
        </Button>
      )}

      {drepId && !drepId.includes('drep') && <ProfileClaimedChip claimedAddress={drepId} />}
      {allActivities && allActivities.length > 0 && (
        <InfiniteScroll
          onScroll={updateDominantActivity}
          dataLength={allActivities.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<p>Loading...</p>}
          endMessage={<p className="text-center">You've caught up!</p>}
          scrollThreshold="200px"
          className="flex flex-col gap-5 pt-5"
        >
          <DrepTimelineWaterfall activity={allActivities} />
        </InfiniteScroll>
      )}
    </div>
  );
};

export default DrepTimeline;
