import axiosInstance from '../axiosInstance';

export const getVoterDataByIdentity = async ({
  voterIdentity,
}: {
  voterIdentity: string;
}) => {
  const response = await axiosInstance.get(`/voters/${voterIdentity}`);
  return response.data;
};
