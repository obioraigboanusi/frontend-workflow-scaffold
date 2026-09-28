import axios from 'axios';

export const API_BASE_URL = import.meta.env.API_BASE_URL;

export const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { data } = error.response;
    return Promise.reject(data.message);
  },
);
