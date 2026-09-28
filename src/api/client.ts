import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const apiClient = axios.create({ baseURL: API_BASE_URL });

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error?.response?.data?.message ?? error?.message;
    return Promise.reject(message || FALLBACK_ERROR_MESSAGE);
  },
);
