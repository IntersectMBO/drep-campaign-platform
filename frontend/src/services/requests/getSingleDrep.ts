import axiosInstance from '../axiosInstance';

export const getSingleDRep = async (drepid: number) => {
  const response = await axiosInstance.get(`/api/dreps/${drepid}/drep`);
  return response.data;
};
