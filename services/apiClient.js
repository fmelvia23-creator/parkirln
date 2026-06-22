import axios from 'axios';

const BASE_URL = 'https://6a376953c105017aa638ef78.mockapi.io/api/slotparkir';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // WAJIB: Timeout 5 detik untuk memenuhi kriteria error handling
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;