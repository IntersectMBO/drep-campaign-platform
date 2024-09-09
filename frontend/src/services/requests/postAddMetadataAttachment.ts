import { NodeObject } from 'jsonld';
import axiosInstance from '../axiosInstance';

export const postAddMetadataAttachment = async ({
  metadata,
  hash,
  drepId,
  name,
}: {
  metadata: NodeObject;
  hash: string;
  drepId: number;
  name: string;
}) => {
  const res = await axiosInstance.post(`/dreps/metadata/save`, {
    metadata,
    hash,
    drepId,
    name,
  });
  return res.data;
};
