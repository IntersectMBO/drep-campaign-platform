import axiosInstance from '../axiosInstance';

export const postAddAttachmentToIPFS = async ({
  attachment,
}: {
  attachment: File | FormData;
}) => {
  const res = await axiosInstance.post(`/attachments/ipfs/add`, attachment);
  return res.data;
};
