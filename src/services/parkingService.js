import apiClient from './apiClient';

export const getInfoParkir = async () => {
  try {
    // Memanggil endpoint spesifik
    const response = await apiClient.get('/parkir_area');
    
    // Karena MockAPI sering membungkus pakai array [ ], kita ambil data pertama (index 0)
    // Jika API-mu tidak pakai [ ], cukup gunakan: const dataParkir = response.data;
    const dataParkir = Array.isArray(response.data) ? response.data[0] : response.data;
    
    console.log("Axios Berhasil! Data ditarik:", dataParkir);
    return { success: true, data: dataParkir };

  } catch (error) {
    // WAJIB: Penanganan Error & Reconnection Alert
    if (error.code === 'ECONNABORTED') {
      console.error("Timeout: Koneksi terputus.");
      return { success: false, message: "Koneksi lambat/terputus. Gagal memuat tarif parkir." };
    } else {
      console.error("Error API:", error.message);
      return { success: false, message: "Terjadi kesalahan pada server parkir." };
    }
  }
};