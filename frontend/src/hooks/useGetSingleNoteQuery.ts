import { getSingleNote } from '@/services/requests/getSingleNote';
import { useQuery } from 'react-query';

export const useGetSingleNoteQuery = (noteId?: any, reload?: boolean) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['note', noteId, reload],
    queryFn: async () => getSingleNote(noteId),
    enabled: reload !== undefined ? Boolean(noteId && reload) : Boolean(noteId),
    refetchOnWindowFocus: false,
  });

  return { Note: data, isNoteLoading: isLoading, refetch };
};
