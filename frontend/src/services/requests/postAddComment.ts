import axiosInstance from "../axiosInstance";

export const postAddComment = async ({parentId, parentEntity, comment, voter}: {parentId: number, parentEntity: string, comment: string, voter: string}) => {
    const response = await axiosInstance.post(`/api/comments/${parentId}/${parentEntity}/add`, {
        comment,
        voter
    });
    return response.data;
}