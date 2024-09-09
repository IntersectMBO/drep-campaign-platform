import axiosInstance from "../axiosInstance"

export const userLogin=async(payload: any) => {
    const reponse=await axiosInstance.post('/auth/login', payload)
    return reponse.data
}