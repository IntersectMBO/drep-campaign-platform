import { QUERY_KEYS } from '@/constants/queryKeys';
import { SingleDRep } from '../../types/api';
import { getSingleDRepViaVoterId } from '@/services/requests/getSingleDrepViaVoterId';
import { useQuery } from 'react-query';

export const useGetSingleDRepViaVoterIdQuery = (
  voterId: string | undefined,
  startTimeCursor?: number ,
  endTimeCursor?: number
) => {
  const { data, isLoading } = useQuery<SingleDRep>({
    queryKey: [QUERY_KEYS.getSingleDRepViaVoterIdKey, voterId, startTimeCursor, endTimeCursor],
    queryFn: async () => await getSingleDRepViaVoterId(voterId,null, startTimeCursor, endTimeCursor),
    enabled: !!voterId,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return { DRep: data, isDRepLoading: isLoading };
};
