import { QUERY_KEYS } from '@/constants/queryKeys';
import { getDReps } from '@/services';
import { useQuery } from 'react-query';

export const useGetDRepsQuery = (
  s?: string,
  page?: number,
  sortBy?: string,
  order?: string,
) => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.getAllDReps, s, page, sortBy, order],
    queryFn: async () => await getDReps(s, page, sortBy, order),
    refetchOnWindowFocus: false,
    enabled: true,
  });

  return { DReps: data, isDRepsLoading: isLoading };
};
