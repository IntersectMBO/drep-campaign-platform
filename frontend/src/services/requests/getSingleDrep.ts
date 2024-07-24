
import { StakeKeys } from '../../../types/commonTypes';
import axiosInstance from '../axiosInstance';

export const getSingleDRep = async (drepid: number, stakeKeys?: StakeKeys, startTimeCursor?: number, endTimeCursor?: number) => {
  console.log("front", {stakeKeys})
  const response = await axiosInstance.get(`/api/dreps/${drepid}/drep`, {
    params: {
      stakeKeys:stakeKeys,
      startTimeCursor: startTimeCursor,
      endTimeCursor: endTimeCursor
    },
  });
  return response.data;
};
