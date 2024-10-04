import axiosInstance from '../axiosInstance';

export const checkTxExists = async (hash: string) => {
  const response = await axiosInstance.get(`misc/tx/${hash}/exists`);

  return response.data;
};
