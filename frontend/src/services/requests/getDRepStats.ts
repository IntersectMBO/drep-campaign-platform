import axiosInstance from '../axiosInstance';

export const getDRepStats = async (voterId?: string) => {
  const response = await axiosInstance.get(`/dreps/${voterId}/stats`);
  return response.data;
};
