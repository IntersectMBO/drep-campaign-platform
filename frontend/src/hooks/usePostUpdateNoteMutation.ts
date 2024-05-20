import { noteInput } from '@/models/note';
import { postUpdateDRepNote } from '@/services/requests/postUpdateDRepNote';
import { useMutation } from 'react-query';

export const usePostUpdateNoteMutation = () => {
  return useMutation(({ noteId, note }: { noteId: number; note: noteInput }) =>
    postUpdateDRepNote(noteId, note),
  );
};
