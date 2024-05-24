import { getDReps } from '@/services';
import { useQuery } from 'react-query';

export const useGetDRepsQuery = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () => await getDReps(),
    //performs automatic refetching
    enabled: true,
  });

  return { DReps: data, isDRepsLoading: isLoading };
};
