import axios from 'axios';
import { urls } from '@/constants';
import {
  clearSession,
  getSessionToken,
  SESSION_EXPIRED_EVENT,
} from '@/lib/session';

const baseURL = urls.baseServerUrl;

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
});

// Send the session token with every API request
axiosInstance.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A rejected session is cleared and the app is asked to log in again
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = String(error?.config?.url ?? '').includes(
      'auth/login',
    );
    if (
      error?.response?.status === 401 &&
      !isLoginRequest &&
      typeof window !== 'undefined'
    ) {
      clearSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

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
