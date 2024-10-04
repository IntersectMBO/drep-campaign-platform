import { MetadataStandard } from '../../../types/commonTypes';
import axiosInstance from '../axiosInstance';

export const postMetadata = async ({
  hash,
  url,
  standard,
}: {
  hash: string;
  url: string;
  standard: MetadataStandard;
}) => {
  const response = await axiosInstance.post(`/dreps/metadata/validate`, {
    hash,
    url,
    standard,
  });
  return response.data;
};
