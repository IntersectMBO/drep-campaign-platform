import { StakeKeys } from '../../../types/commonTypes';
import axiosInstance from '../axiosInstance';

export const getNotes = async (stakeKeys?: StakeKeys, beforeNote?: number, afterNote?: number) => {
  const response = await axiosInstance.get(`/api/notes/all`, {
    params: {
      stakeKeys: stakeKeys,
      beforeNoteCursor: beforeNote,
      afterNoteCursor: afterNote
    },
  });
  return response.data;
};
