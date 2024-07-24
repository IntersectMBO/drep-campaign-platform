import { QUERY_KEYS } from '@/constants/queryKeys';
import { currentDelegation } from '../../types/api';
import { getAdaHolderCurrentDelegation } from '@/services/requests/getAdaHolderCurrentDelegation';
import { useQuery } from 'react-query';

export const useGetAdaHolderCurrentDelegationQuery = (
  stakeKey: string | undefined,
) => {
  const { data, isLoading } = useQuery<currentDelegation>({
    queryKey: [QUERY_KEYS.getAdaHolderCurrentDelegationKey],
    queryFn: async () => await getAdaHolderCurrentDelegation(stakeKey),
    enabled: !!stakeKey,
    refetchOnWindowFocus: false,
  });

  return { currentDelegation: data, isCurrentDelegationLoading: isLoading};
};
