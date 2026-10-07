import { StakeKeys } from '../../../types/commonTypes';
import axiosInstance from '../axiosInstance';

export const getSingleNote = async (noteid: number, stakeKeys?: StakeKeys) => {
  const response = await axiosInstance.get(`/notes/${noteid}/single`, {
    params: {
      stakeKeys: stakeKeys,
    },
  });
  return response.data;
};
