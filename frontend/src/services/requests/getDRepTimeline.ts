import { StakeKeys } from '../../../types/commonTypes';
import axiosInstance from '../axiosInstance';

export const getDRepTimeline = async (
  idOrVoterId: string,
  stakeKeys?: StakeKeys,
  startTimeCursor?: number,
  endTimeCursor?: number,
  filterValues?: string[] | undefined,
) => {
  const response = await axiosInstance.get(`/dreps/${idOrVoterId}/activity`, {
    params: {
      stakeKeys: stakeKeys,
      startTimeCursor: startTimeCursor,
      endTimeCursor: endTimeCursor,
      filterValues: filterValues,
    },
  });
  return response.data;
};
