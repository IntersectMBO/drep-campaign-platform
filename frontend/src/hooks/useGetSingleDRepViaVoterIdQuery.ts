import { QUERY_KEYS } from '@/constants/queryKeys';
import { SingleDRep } from '../../types/api';
import { getSingleDRepViaVoterId } from '@/services/requests/getSingleDrepViaVoterId';
import { useQuery } from 'react-query';

export const useGetSingleDRepViaVoterIdQuery = (
  voterId: string | undefined,
) => {
  const { data, isLoading } = useQuery<SingleDRep>({
    queryKey: [QUERY_KEYS.getSingleDRepViaVoterIdKey, voterId],
    queryFn: async () => await getSingleDRepViaVoterId(voterId),
    enabled: !!voterId,
    refetchOnWindowFocus: false,
  });

  return { DRep: data, isDRepLoading: isLoading };
};
