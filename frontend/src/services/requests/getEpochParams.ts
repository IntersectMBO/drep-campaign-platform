import axiosInstance from "../axiosInstance"

const getEpochParams= async () => {
    const response=await axiosInstance.get('/api/dreps/epochs/latest/parameters')
    return response.data
}
export default getEpochParams