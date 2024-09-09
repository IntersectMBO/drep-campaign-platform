import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from 'react-query';
import { getDRepStats } from '@/services/requests/getDRepStats';
import { DRepStats } from '../../types/api';

export const useGetDRepStatsQuery = (voterId: string) => {
  const { data, isLoading } = useQuery<DRepStats>({
    queryKey: [QUERY_KEYS.getDRepStatsKey, voterId],
    queryFn: async () => await getDRepStats(voterId),
    enabled: !!voterId,
    refetchOnWindowFocus: false,
  });

  return { DRepStats: data, isDRepStatsLoading: isLoading };
};
