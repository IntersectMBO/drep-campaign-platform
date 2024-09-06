import axiosInstance from '../axiosInstance';

export const postRemoveReaction = async (reactionData) => {
  const response = await axiosInstance.post(`/api/reactions/remove`, reactionData);
  return response.data;
};
