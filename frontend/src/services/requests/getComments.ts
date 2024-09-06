import axiosInstance from "../axiosInstance";

export const getComments = async (parentId: number, parentEntity: string) => {
    const response = await axiosInstance.get(`/api/comments/${parentId}/${parentEntity}`);
    return response.data;
}