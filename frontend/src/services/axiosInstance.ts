import axios from 'axios';
import { PATHS, urls } from '../constants';

const baseURL = urls.baseServerUrl;

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
});
//can also intercept to navigate to an error page
export const SetupInterceptors = () =>
  axiosInstance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error?.response?.status === 500) {
        throw new Error(error?.response);
      }

      return Promise.reject(error);
    },
  );
export default axiosInstance;
