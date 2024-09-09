import axiosInstance from '../axiosInstance';

export const getDRepRegStatus = async (voterId: string) => {
  const response = await axiosInstance.get(`/dreps/${voterId}/is-registered`);
  return response.data;
};
