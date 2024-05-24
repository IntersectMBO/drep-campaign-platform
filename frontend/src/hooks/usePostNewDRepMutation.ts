import { drepInput } from '@/models/drep';
import { postNewDRep } from '@/services/requests/postAddDRep';
import { useMutation } from 'react-query';

export const usePostNewDrepMutation = () => {
  return useMutation(({ drep }: { drep: drepInput }) => postNewDRep(drep));
};
