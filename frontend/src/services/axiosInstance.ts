import axios from "axios";
import { PATHS, urls } from "../constants";

const baseURL = urls.baseLocalUrl

const axiosInstance = axios.create({
	baseURL,timeout:5000
});

export const SetupInterceptors = (navigate:any) =>
  axiosInstance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error?.response?.status === 500) {
        navigate(PATHS.error, { state: { errorCode: 500 } });
      }

      return Promise.reject(error);
    }
  );
export default axiosInstance;
