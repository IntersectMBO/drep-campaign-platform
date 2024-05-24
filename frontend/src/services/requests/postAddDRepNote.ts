import { noteInput } from '@/models/note';
import axiosInstance from '../axiosInstance';
export const postNewDRepNote = async (note: noteInput) => {
  const response = await axiosInstance.post(`/api/notes/new`, note);
  return response.data;
};
