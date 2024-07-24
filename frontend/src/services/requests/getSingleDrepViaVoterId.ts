
import { StakeKeys } from '../../../types/commonTypes';
import axiosInstance from '../axiosInstance';

export const getSingleDRepViaVoterId = async (
  voterid: string,
  stakeKeys?: StakeKeys,
  startTimeCursor?: number,
  endTimeCursor?: number
) => {
  const response = await axiosInstance.get(`/api/dreps/${voterid}/voter`, {
    params: {
      stakeKeys:stakeKeys,
      startTimeCursor: startTimeCursor,
      endTimeCursor: endTimeCursor
    },
  });
  return response.data;
};
