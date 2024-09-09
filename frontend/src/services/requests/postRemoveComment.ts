import axiosInstance from "../axiosInstance";

//may come in handy later for deleting comments
export const postRemoveComment = async (parentId: number, parentEntity: string, comment: string, voter: string) => {
    const response = await axiosInstance.post(`/comments/${parentId}/${parentEntity}/remove`, {
        comment,
        voter
    });
    return response.data;
}