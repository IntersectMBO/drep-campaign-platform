import axiosInstance from '../axiosInstance';

export const getUserNotifications = async () => {
  const response = await axiosInstance.get(`/notifications` );

  return response.data;
};
