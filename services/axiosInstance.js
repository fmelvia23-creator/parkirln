// services/axiosInstance.js
// Instance Axios terpusat untuk semua request ke MockAPI (tarif & kuota harian).
// Anggota 2 cukup pakai instance ini di sensorApi.js / komponen lain,
// tidak perlu setup axios berulang-ulang.

import axios from 'axios';

// TODO: ganti BASE_URL dengan endpoint MockAPI tim (https://mockapi.io/projects/...)
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
