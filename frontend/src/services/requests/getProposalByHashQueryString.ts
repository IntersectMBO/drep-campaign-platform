import axiosInstance from '../axiosInstance';

export const getProposalByHashQueryString = async (hashQueryString: string) => {
  const response = await axiosInstance.get(`proposals`, {
    params: {
      query: hashQueryString,
    },
  });
  return response.data;
};
