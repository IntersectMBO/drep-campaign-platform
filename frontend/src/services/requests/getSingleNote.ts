import axiosInstance from '../axiosInstance';

export const getSingleNote = async (drepid: number) => {
  const response = await axiosInstance.get(`/notes/${drepid}/single`);
  return response.data;
};
