import axiosInstance from '../axiosInstance';

export const getVoterGovActions = async (
  voterIdentity: string,
  page?: number,
) => {
  const response = await axiosInstance.get(
    `/voters/${voterIdentity}/governance-actions`,
    {
      params: { page },
    },
  );
  return response.data;
};
