import { StakeKeys } from '../../../types/commonTypes';
import axiosInstance from '../axiosInstance';

export const getNotes = async (
  stakeKeys?: StakeKeys,
  currentNote?: number,
  request?: string,
) => {
  const response = await axiosInstance.get(`/notes/all`, {
    params: {
      stakeKeys: stakeKeys,
      currentNoteCursor: currentNote,
      request: request,
    },
  });
  return response.data;
};
