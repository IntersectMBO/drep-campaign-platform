import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from 'react-query';
import { getDRepTimeline } from '@/services/requests/getDRepTimeline';
import { useCardano } from '@/context/walletContext';
import { StakeKeys } from '../../types/commonTypes';
import { useEffect, useRef, useState } from 'react';
import { useGlobalNotifications } from '@/context/globalNotificationContext';
import { formatNumberTimeToReadable } from '@/lib';

export const useGetDRepTimelineQuery = (
  idOrVoterId: string | string[] | undefined,
  filterValues?: string[] | undefined,
) => {
  const [timeLineData, setTimeLineData] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { stakeKey, stakeKeyBech32 } = useCardano();
  const { addWarningAlert } = useGlobalNotifications();
  const stakeKeys: StakeKeys = { stakeKey, stakeKeyBech32 };
  const prevFilterValuesRef = useRef<string[] | undefined>(filterValues);

  const [queryEndTime, setQueryEndTime] = useState(() => Date.now());
  const [queryStartTime, setQueryStartTime] = useState(
    () => queryEndTime - 3 * 24 * 60 * 60 * 1000,
  );

  const [timelineEndTime, setTimelineEndTime] = useState(queryEndTime);
  const [timelineStartTime, setTimelineStartTime] = useState(queryStartTime);

  useEffect(() => {
    const prevFilterValues = prevFilterValuesRef.current;
    const filtersHaveChanged =
      JSON.stringify(prevFilterValues) !== JSON.stringify(filterValues);

    if (filtersHaveChanged) {
      setTimeLineData([]);
      setIsInitialLoad(true);
      setTimelineEndTime(queryEndTime);
      setTimelineStartTime(queryStartTime);
    }

    prevFilterValuesRef.current = filterValues;
  }, [filterValues]);

  const { isLoading } = useQuery({
    queryKey: [
      QUERY_KEYS.getDRepTimelineKey,
      idOrVoterId,
      queryEndTime,
      queryStartTime,
      filterValues,
    ],
    queryFn: async () =>
      await getDRepTimeline(
        String(idOrVoterId),
        stakeKeys,
        queryEndTime,
        queryStartTime,
        filterValues,
      ),
    enabled:
      !!idOrVoterId &&
      !!queryEndTime &&
      !!queryStartTime &&
      stakeKey !== null &&
      stakeKeyBech32 !== null &&
      filterValues !== null,
    refetchOnWindowFocus: false,
    onSuccess: (newData) => {
      if (newData.length === 0) {
        addWarningAlert(
          `No results found for period between ${formatNumberTimeToReadable(queryStartTime)} and ${formatNumberTimeToReadable(queryEndTime)}`,
        );
        setIsInitialLoad(false);
        return;
      }
      setTimeLineData((prevData) => {
        if (prevData.length < 1) {
          setIsInitialLoad(false);
        }
        const isNewer =
          newData?.[newData.length - 1]?.timestamp > prevData?.[0]?.timestamp;
        if (isNewer) {
          return [...newData, ...prevData];
        } else {
          return [...prevData, ...newData];
        }
      });
    },
  });

  return {
    DRepActivity: timeLineData,
    isDRepActivityLoading: isLoading,
    isInitialLoad: isInitialLoad,
    queryEndTime,
    setQueryEndTime,
    queryStartTime,
    setQueryStartTime,
    timelineEndTime,
    setTimelineEndTime,
    timelineStartTime,
    setTimelineStartTime,
  };
};
