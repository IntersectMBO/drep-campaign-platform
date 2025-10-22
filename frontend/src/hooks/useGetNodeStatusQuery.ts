import { getCurrentNodeStatus } from '@/services/requests/getCurrentNodeStatus';
import { useQuery } from 'react-query';

export const useGetNodeStatusQuery = ({disablePolling=false}:{disablePolling:boolean}) => {
  const { data, isLoading, isFetching, isError, error , isSuccess, isFetchedAfterMount} = useQuery({
    queryKey: 'nodeStatus',
    queryFn: async () => getCurrentNodeStatus(),
    refetchInterval: disablePolling ? false : 10000,
    refetchOnWindowFocus: false,
  });
  return {
    NodeStatus: data,
    isLoading,
    isFetching,
    isFetchedAfterMount,
    isError: !isSuccess || isError,
    error,
  };
};
