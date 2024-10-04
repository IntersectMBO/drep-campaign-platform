import { QUERY_KEYS } from '@/constants/queryKeys';
import { useCardano } from '@/context/walletContext';
import { getNotes } from '@/services/requests/getNotes';
import { useQuery } from 'react-query';
import { StakeKeys } from '../../types/commonTypes';

type GetNotesProps = {
  currentNote?: number;
  request?: string;
}
export const useGetNotesQuery = ({ currentNote, request }: GetNotesProps = {}) => {
  const { stakeKey, stakeKeyBech32 } = useCardano();
  const stakeKeys: StakeKeys = { stakeKey, stakeKeyBech32 };
  const { data, isLoading, refetch, isFetching, isPreviousData } = useQuery({
    queryKey: [QUERY_KEYS.getNotesKey, stakeKeys, currentNote,request],
    queryFn: async () => await getNotes(stakeKeys, currentNote,request),
    refetchOnWindowFocus: false,
    enabled: true,
    keepPreviousData: true,
  });
  return { Notes: data, isNotesLoading: isLoading, refetch, isNotesFetching: isFetching, isPreviousData };
};