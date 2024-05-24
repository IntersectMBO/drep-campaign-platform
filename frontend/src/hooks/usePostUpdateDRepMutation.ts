import { drepInput } from '@/models/drep';
import { postUpdateDRep } from '@/services/requests/postUpdateDRep';
import { useMutation } from 'react-query';

export const usePostUpdateDrepMutation = () => {
  return useMutation(({ drepId, drep }: { drepId: number; drep: drepInput }) =>
    postUpdateDRep(drepId, drep),
  );
};
