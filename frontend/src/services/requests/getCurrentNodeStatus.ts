import axiosInstance from "../axiosInstance";

export const getCurrentNodeStatus = async () => {
    const response = await axiosInstance.get(`/misc/node/status`);
    return response.data;
}