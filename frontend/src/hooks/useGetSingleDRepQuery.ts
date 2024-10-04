import { QUERY_KEYS } from '@/constants/queryKeys';
import { getSingleDRep } from '@/services/requests/getSingleDrep';
import { getSingleDRepViaVoterId } from '@/services/requests/getSingleDrepViaVoterId';
import { useQuery } from 'react-query';

export const useGetSingleDRepQuery = (drepId?: any) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.getSingleDRepKey],
    queryFn: async () =>
      drepId.includes('drep')
        ? await getSingleDRepViaVoterId(drepId)
        : await getSingleDRep(drepId),

    refetchOnWindowFocus: false,
  });

  return { dRep: data, isDRepLoading: isLoading, refetch };
};
