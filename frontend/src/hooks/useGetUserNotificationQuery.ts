import { useQuery } from 'react-query';
import {getUserNotifications} from "@/services/requests/getUserNotifications";

export const useGetUserNotificationQuery = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () =>
      await getUserNotifications(),
  });

  return { notifications: data, loading: isLoading };
};
