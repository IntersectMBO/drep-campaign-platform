import { QUERY_KEYS } from '@/constants/queryKeys';
import { useCardano } from '@/context/walletContext';
import { getSingleDRep } from '@/services/requests/getSingleDrep';
import { getSingleDRepViaVoterId } from '@/services/requests/getSingleDrepViaVoterId';
import { useQuery } from 'react-query';
import { StakeKeys } from '../../types/commonTypes';
import { useState } from 'react';

export const useGetSingleDRepQuery = (
  drepId?: any,
  initialStartTime?: number,
  initialEndTime?: number,
) => {
  const { stakeKey, stakeKeyBech32 } = useCardano();
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const stakeKeys: StakeKeys = { stakeKey, stakeKeyBech32 };
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.getSingleDRepKey, stakeKey, startTime, endTime],
    queryFn: async () =>
      drepId.includes('drep')
        ? await getSingleDRepViaVoterId(drepId, stakeKeys, startTime, endTime)
        : await getSingleDRep(drepId, stakeKeys, startTime, endTime),
    
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const updateTimeRange = (newStartTime: number, newEndTime: number) => {
    setStartTime(newStartTime);
    setEndTime(newEndTime);
  };

  return { dRep: data, isDRepLoading: isLoading, refetch, updateTimeRange };
};
