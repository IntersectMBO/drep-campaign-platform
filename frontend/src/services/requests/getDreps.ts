import axiosInstance from '../axiosInstance';

export const getDReps = async () => {
  const response = await axiosInstance.get(`/api/dreps`);

  return response.data;
};
