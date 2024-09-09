import axiosInstance from '../axiosInstance';

export const getDReps = async (
  s?: string,
  page?: number,
  sort?: string,
  order?: string,
  onChainStatus?: string,
  campaignStatus?: string,
  type?: string,
) => {
  const response = await axiosInstance.get(`/dreps`, {
    params: { s, page, sort, order, onChainStatus, campaignStatus, type },
  });

  return response.data;
};
