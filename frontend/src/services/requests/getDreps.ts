import axiosInstance from '../axiosInstance';

export const getDReps = async (
  s?: string,
  page?: number,
  sortBy?: string,
  order?: string,
) => {
  const response = await axiosInstance.get(`/api/dreps`, {
    params: { s, page, sortBy, order },
  });

  return response.data;
};
