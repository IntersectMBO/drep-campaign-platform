import { getVoterDataByIdentity } from '@/services/requests/getVoterDataByIdentity';
import { useQuery } from 'react-query';
import { VoterData } from '../../types/api';

export const useVoterDataByIdentityQuery = (
  voterIdentity: string,
): { voterData: VoterData | undefined; isVoterDataLoading: boolean } => {
  const { data, isLoading } = useQuery({
    queryKey: ['voters', voterIdentity],
    queryFn: async () => await getVoterDataByIdentity({ voterIdentity }),
    enabled: !!voterIdentity,
    refetchOnWindowFocus: false,
  });

  return { voterData: data, isVoterDataLoading: isLoading };
};
