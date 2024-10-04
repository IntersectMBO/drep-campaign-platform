import axiosInstance from '../axiosInstance';

export const postAddReaction = async (reactionData) => {
  const response = await axiosInstance.post(`/reactions/add`, reactionData);
  return response.data;
};
