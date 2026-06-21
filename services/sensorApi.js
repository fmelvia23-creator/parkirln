// services/sensorApi.js
// Sumber data status slot parkir.
// Tiap slot dipantau 2 sensor terpisah:
//   - ultrasonik (VL53L0X)  -> dipasang di langit-langit, deteksi ada objek masuk slot
//   - proximity  (induktif) -> dipasang di lantai pembatas, deteksi plat/besi kendaraan pas posisi
// Status tiap sensor disimpan APA ADANYA, tidak digabung otomatis jadi satu logika AND/OR.
// Field `status` (kosong/terisi) adalah status akhir yang ditentukan terpisah
// (oleh hardware/Firebase nanti, atau bisa diisi manual sesuai aturan tim) dan
// itulah satu-satunya field yang dipakai DashboardScreens.jsx untuk warna grid.
//
// Saat ini pakai DUMMY DATA (Firebase belum siap dari Anggota 3).
// Begitu Firebase Realtime Database siap, ganti isi getParkingSlots()
// dan subscribeParkingSlots() memakai kode yang sudah disiapkan di bagian bawah (dikomentari),
// tanpa perlu ubah apapun di DashboardScreens.jsx.

import axiosInstance from './axiosInstance';
// import { database } from './firebaseConfig';
// import { ref, onValue, off } from 'firebase/database';

// ---------- DUMMY DATA ----------
// Struktur ini disengaja sama persis dengan bentuk data yang nanti dikirim sensor ke Firebase,
// supaya saat pindah ke data asli, komponen Dashboard tidak perlu diubah.
// ultrasonik & proximity: 'terdeteksi' | 'kosong'
let DUMMY_SLOTS = [
  { id: 'A1', area: 'A', status: 'kosong', ultrasonik: 'kosong', proximity: 'kosong' },
  { id: 'A2', area: 'A', status: 'terisi', ultrasonik: 'terdeteksi', proximity: 'terdeteksi' },
  { id: 'A3', area: 'A', status: 'kosong', ultrasonik: 'kosong', proximity: 'kosong' },
  { id: 'A4', area: 'A', status: 'kosong', ultrasonik: 'kosong', proximity: 'kosong' },
  { id: 'A5', area: 'A', status: 'terisi', ultrasonik: 'terdeteksi', proximity: 'terdeteksi' },
  { id: 'B1', area: 'B', status: 'terisi', ultrasonik: 'terdeteksi', proximity: 'kosong' },
  { id: 'B2', area: 'B', status: 'kosong', ultrasonik: 'kosong', proximity: 'kosong' },
  { id: 'B3', area: 'B', status: 'kosong', ultrasonik: 'kosong', proximity: 'kosong' },
  { id: 'B4', area: 'B', status: 'terisi', ultrasonik: 'terdeteksi', proximity: 'terdeteksi' },
  { id: 'B5', area: 'B', status: 'kosong', ultrasonik: 'kosong', proximity: 'kosong' },
];

/**
 * Ambil snapshot status slot parkir sekali (mis. saat pertama buka Dashboard).
 * @returns {Promise<Array<{id: string, area: string, status: 'kosong'|'terisi', ultrasonik: 'kosong'|'terdeteksi', proximity: 'kosong'|'terdeteksi'}>>}
 */
export async function getParkingSlots() {
  // Simulasi delay network supaya loading state terlihat natural
  await new Promise((resolve) => setTimeout(resolve, 400));
  return DUMMY_SLOTS;
}

/**
 * Ambil detail pembacaan 2 sensor untuk satu slot tertentu.
 * Disiapkan terpisah dari status akhir, kalau nanti dibutuhkan halaman/modal
 * detail slot yang menampilkan kondisi ultrasonik & proximity masing-masing.
 * @param {string} slotId
 */
export async function getSensorDetailBySlotId(slotId) {
  const slot = DUMMY_SLOTS.find((s) => s.id === slotId);
  if (!slot) return null;
  return {
    id: slot.id,
    ultrasonik: slot.ultrasonik,
    proximity: slot.proximity,
    status: slot.status,
  };
}

/**
 * Berlangganan perubahan status slot secara real-time.
 * Versi dummy ini mengacak satu slot setiap beberapa detik untuk simulasi sensor.
 * @param {(slots: Array) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeParkingSlots(callback) {
  callback(DUMMY_SLOTS);

  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * DUMMY_SLOTS.length);
    DUMMY_SLOTS = DUMMY_SLOTS.map((slot, idx) => {
      if (idx !== randomIndex) return slot;
      // Simulasi: kendaraan masuk/keluar mengubah status akhir SEKALIGUS
      // pembacaan kedua sensor (di dunia nyata, dua sensor ini dikirim hardware
      // sebagai dua nilai independen lewat firebaseConfig -> Realtime Database).
      const akanTerisi = slot.status === 'kosong';
      return {
        ...slot,
        status: akanTerisi ? 'terisi' : 'kosong',
        ultrasonik: akanTerisi ? 'terdeteksi' : 'kosong',
        proximity: akanTerisi ? 'terdeteksi' : 'kosong',
      };
    });
    callback(DUMMY_SLOTS);
  }, 6000);

  return () => clearInterval(interval);
}

/**
 * Ambil info tarif & kuota harian dari MockAPI (Anggota 2 - Axios).
 * Sudah dibungkus try/catch dan fallback dummy supaya UI tidak crash
 * kalau endpoint MockAPI belum diisi tim.
 */
export async function getTarifDanKuota() {
  try {
    const response = await axiosInstance.get('/tarif');
    return response.data;
  } catch (error) {
    console.log('[sensorApi] Gagal ambil tarif dari MockAPI, pakai fallback:', error?.message);
    return {
      tarifPerJam: 3000,
      kuotaHarian: 50,
      kuotaTerpakai: 28,
    };
  }
}

/**
 * Ambil riwayat keluar-masuk slot untuk HistoryScreens.
 * Dummy dulu, nanti bisa diganti query ke Firebase (history log) atau MockAPI.
 */
export async function getParkingHistory() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: 'h1', slotId: 'A2', aksi: 'masuk', waktu: '08:12' },
    { id: 'h2', slotId: 'B4', aksi: 'masuk', waktu: '08:30' },
    { id: 'h3', slotId: 'A5', aksi: 'masuk', waktu: '09:05' },
    { id: 'h4', slotId: 'B1', aksi: 'masuk', waktu: '09:21' },
    { id: 'h5', slotId: 'A1', aksi: 'keluar', waktu: '07:55' },
  ];
}

// ---------- VERSI FIREBASE (aktifkan saat siap) ----------
// export function subscribeParkingSlots(callback) {
//   const slotsRef = ref(database, 'slots');
//   const listener = onValue(slotsRef, (snapshot) => {
//     const data = snapshot.val() || {};
//     const slots = Object.entries(data).map(([id, value]) => ({ id, ...value }));
//     callback(slots);
//   });
//   return () => off(slotsRef, 'value', listener);
// }
