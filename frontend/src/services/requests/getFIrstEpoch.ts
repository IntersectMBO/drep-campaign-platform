import axiosInstance from '../axiosInstance';

const getFirstEpoch = async () => {
  const response = await axiosInstance.get('misc/epochs/first');
  return response.data;
};
export default getFirstEpoch;
