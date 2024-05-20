import { noteInput } from '@/models/note';
import axiosInstance from '../axiosInstance';
export const postUpdateDRepNote = async (noteid: number, note: noteInput) => {
  const response = await axiosInstance.post(
    `/api/notes/${noteid}/update`,
    note,
  );
  return response.data;
};
