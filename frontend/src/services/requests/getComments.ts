import axiosInstance from "../axiosInstance";

export const getComments = async (parentId: number, parentEntity: string) => {
    const response = await axiosInstance.get(`/comments/${parentId}/${parentEntity}`);
    return response.data;
}