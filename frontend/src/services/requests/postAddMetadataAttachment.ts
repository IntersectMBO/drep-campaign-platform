import { NodeObject } from 'jsonld';
import axiosInstance from '../axiosInstance';

export const postAddMetadataAttachment = async ({
  metadata,
}: {
  metadata: NodeObject;
}) => {
  const res = await axiosInstance.post(`/dreps/metadata/save`, {
    metadata,
  });
  return res.data;
};
