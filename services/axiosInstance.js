import axios from 'axios';

const BASE_URL = 'https://6a376953c105017aa638ef78.mockapi.io/api/slotparkir';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
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
