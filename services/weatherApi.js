// services/weatherApi.js
// Placeholder untuk info cuaca (opsional, jika ParkirIn nanti menampilkan
// peringatan cuaca terkait area parkir outdoor). Tidak dipakai wajib di brief utama,
// disediakan agar file yang sudah ada di struktur project tidak kosong/error saat di-import.

import axiosInstance from './axiosInstance';

const WEATHER_API_KEY = 'YOUR_WEATHER_API_KEY';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getCurrentWeather(city = 'Surabaya') {
  try {
    const response = await axiosInstance.get(`${WEATHER_BASE_URL}/weather`, {
      params: { q: city, appid: WEATHER_API_KEY, units: 'metric', lang: 'id' },
    });
    return response.data;
  } catch (error) {
    console.log('[weatherApi] Gagal ambil data cuaca, pakai fallback:', error?.message);
    return {
      name: city,
      main: { temp: 30 },
      weather: [{ description: 'cerah berawan' }],
    };
  }
}
