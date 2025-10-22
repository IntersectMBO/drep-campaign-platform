import axiosInstance from '../axiosInstance';

export const getDReps = async (
  s?: string,
  page?: number,
  sort?: string,
  order?: string,
  onChainStatus?: string,
  campaignStatus?: string,
  includeRetired?: string,
  type?: string,
) => {
  const response = await axiosInstance.get(`/dreps`, {
    params: { s, page, sort, order, onChainStatus, campaignStatus, includeRetired, type },
  });

  return response.data;
};
