import axiosInstance from '../axiosInstance';
import { drepInput } from '@/models/drep';
export const postUpdateDRep = async (drepid: number, drep: drepInput) => {
  const response = await axiosInstance.post(
    `/dreps/${drepid}/update`,
    drep,
  );
  return response.data;
};
