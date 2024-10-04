import { QUERY_KEYS } from '@/constants/queryKeys';
import { getDReps } from '@/services';
import { useQuery } from 'react-query';

export const useGetDRepsQuery = (
  s?: string,
  page?: number,
  sort?: string,
  order?: string,
  onChainStatus?: string,
  campaignStatus?: string,
  includeRetired?: string,
  type?: string,
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      QUERY_KEYS.getAllDRepsKey,
      s,
      page,
      sort,
      order,
      onChainStatus,
      campaignStatus,
      includeRetired,
      type,
    ],
    queryFn: async () =>
      await getDReps(s, page, sort, order, onChainStatus, campaignStatus, includeRetired, type),
    refetchOnWindowFocus: false,
    enabled: true,
  });

  return { DReps: data, isDRepsLoading: isLoading, isError };
};
