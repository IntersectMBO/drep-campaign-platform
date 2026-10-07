import axiosInstance from '../axiosInstance';

export type DataSignature = {
  signature: string;
  key: string;
};

export type LoginPayload = {
  message: string;
  stakeAddress: string;
  stake: DataSignature;
  drep?: DataSignature;
  expiry?: string;
};

export const getLoginChallenge = async (): Promise<{
  message: string;
  expiresAt: string;
}> => {
  const response = await axiosInstance.get('/auth/challenge');
  return response.data;
};

export const userLogin = async (
  payload: LoginPayload,
): Promise<{ token: string; stakeAddress: string; drepId?: string }> => {
  const reponse = await axiosInstance.post('/auth/login', payload);
  return reponse.data;
};
