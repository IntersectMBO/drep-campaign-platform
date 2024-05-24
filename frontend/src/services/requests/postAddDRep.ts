import { drepInput } from '@/models/drep';
import axiosInstance from '../axiosInstance';
export const postNewDRep = async (drep: drepInput) => {
  const response = await axiosInstance.post(`/api/dreps/new`, drep);
  return response.data;
};
