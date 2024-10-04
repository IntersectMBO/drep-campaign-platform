import { useQuery } from 'react-query';
import { getVoterGovActions } from '@/services/requests/getVoterGovActions';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { VoterGovActions } from '../../types/api';

export const useGetVoterGovActionsQuery = (voterIdentity: string, page?: number,) => {
  const { data, isLoading } = useQuery<VoterGovActions>({
    queryKey: [QUERY_KEYS.getVoterGovActions, voterIdentity, page],
    queryFn: async () => await getVoterGovActions(voterIdentity, page),
    enabled: !!voterIdentity,
    refetchOnWindowFocus: false,
  });

  return { voterGovActions: data, isVoterGovActionsLoading: isLoading };
};
