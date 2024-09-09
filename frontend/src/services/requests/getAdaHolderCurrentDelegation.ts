import axiosInstance from '../axiosInstance';

export const getAdaHolderCurrentDelegation = async (stakeKey: string) => {
  const response = await axiosInstance.get(`voters/${stakeKey}/delegation`);

  return response.data;
};
