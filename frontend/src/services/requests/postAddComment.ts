import axiosInstance from '../axiosInstance';

type AddCommentParams = {
  rootEntity: string;
  rootEntityId: number;
  parentId: number;
  parentEntity: string;
  comment: string;
  voter: string;
};
export const postAddComment = async ({
  rootEntity,
  rootEntityId,
  parentId,
  parentEntity,
  comment,
  voter,
}: AddCommentParams) => {
  const response = await axiosInstance.post(
    `/comments/${parentId}/${parentEntity}/add`,
    {
      comment,
      voter,
      rootEntity,
      rootEntityId,
    },
  );
  return response.data;
};
