import axiosInstance from '../axiosInstance';

export const getDRepMetadata = async (voterId: string) => {
  const response = await axiosInstance.get(`/dreps/${voterId}/metadata`);
  return response.data;
};