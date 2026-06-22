import axios from 'axios';

const BASE_URL = 'https://000000.mockapi.io/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Logging ringan tiap request (gampang dimatikan kalau sudah production)
axiosInstance.interceptors.request.use((config) => {
  console.log(`[Axios] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('[Axios] Error:', error?.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
