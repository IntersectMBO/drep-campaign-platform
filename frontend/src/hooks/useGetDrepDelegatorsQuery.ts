import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from 'react-query';
import { Delegators } from '../../types/api';
import { getDrepDelegators } from '@/services/requests/getDrepDelegators';

export const useGetDrepDelegators = (
  voterId: string,
  page?: number,
  perPage?: number,
  sort?: string,
  order?: string,
) => {
  const { data, isLoading } = useQuery<Delegators>({
    queryKey: [QUERY_KEYS.getDrepDelegators, voterId, page, sort, order],
    queryFn: async () =>
      await getDrepDelegators(voterId, page, perPage, sort, order),
    enabled: !!voterId,
    refetchOnWindowFocus: false,
  });

  return { Delegators: data, isDelegatorsLoading: isLoading };
};
