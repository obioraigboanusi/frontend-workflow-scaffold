import axios, { type AxiosError } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const apiClient = axios.create({ baseURL: API_BASE_URL });

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

apiClient.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- untyped payload boundary
  (response) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message ?? error.message;
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- string contract
    return Promise.reject(message || FALLBACK_ERROR_MESSAGE);
  },
);
