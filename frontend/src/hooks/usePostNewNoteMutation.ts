import { noteInput } from '@/models/note';
import { postNewDRepNote } from '@/services/requests/postAddDRepNote';
import { useMutation } from 'react-query';

export const usePostNewNoteMutation = () => {
  return useMutation(({ note }: { note: noteInput }) => postNewDRepNote(note));
};
