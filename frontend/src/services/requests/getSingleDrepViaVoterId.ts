import axiosInstance from '../axiosInstance';

export const getSingleDRepViaVoterId = async (voterid: string) => {
  const response = await axiosInstance.get(`/dreps/${voterid}/voter`);
  return response.data;
};
