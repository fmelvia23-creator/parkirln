

import axiosInstance from './axiosInstance';
// import { database } from './firebaseConfig';
// import { ref, onValue, off } from 'firebase/database';

// ---------- DUMMY DATA ----------
// 5 slot VIP per area (Area A: 5 slot, Area B: 5 slot, total 10 slot).
let DUMMY_SLOTS = [
  { id: 'A1', area: 'A', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 1.8, suhuCelsius: 29, kelembapanPersen: 62 },
  { id: 'A2', area: 'A', status: 'terisi', ultrasonikMasuk: 'terdeteksi', proximity: 'terdeteksi', jarakTembokMeter: 0.6, suhuCelsius: 31, kelembapanPersen: 58 },
  { id: 'A3', area: 'A', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 1.5, suhuCelsius: 28, kelembapanPersen: 65 },
  { id: 'A4', area: 'A', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 2.0, suhuCelsius: 28, kelembapanPersen: 64 },
  { id: 'A5', area: 'A', status: 'terisi', ultrasonikMasuk: 'terdeteksi', proximity: 'terdeteksi', jarakTembokMeter: 0.9, suhuCelsius: 30, kelembapanPersen: 60 },

  { id: 'B1', area: 'B', status: 'terisi', ultrasonikMasuk: 'terdeteksi', proximity: 'kosong', jarakTembokMeter: 1.2, suhuCelsius: 28, kelembapanPersen: 63 },
  { id: 'B2', area: 'B', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 2.1, suhuCelsius: 27, kelembapanPersen: 66 },
  { id: 'B3', area: 'B', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 1.7, suhuCelsius: 27, kelembapanPersen: 67 },
  { id: 'B4', area: 'B', status: 'terisi', ultrasonikMasuk: 'terdeteksi', proximity: 'terdeteksi', jarakTembokMeter: 0.5, suhuCelsius: 32, kelembapanPersen: 57 },
  { id: 'B5', area: 'B', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 1.9, suhuCelsius: 28, kelembapanPersen: 64 },
];

/**
 * Ambil snapshot status slot parkir sekali (mis. saat pertama buka Dashboard).
 */
export async function getParkingSlots() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return DUMMY_SLOTS;
}

/**
 * Ambil detail pembacaan sensor untuk satu slot tertentu.
 * @param {string} slotId
 */
export async function getSensorDetailBySlotId(slotId) {
  const slot = DUMMY_SLOTS.find((s) => s.id === slotId);
  if (!slot) return null;
  return { ...slot };
}

/**
 * 
 * @param {(slots: Array) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeParkingSlots(callback) {
  callback(DUMMY_SLOTS);

  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * DUMMY_SLOTS.length);
    DUMMY_SLOTS = DUMMY_SLOTS.map((slot, idx) => {
      if (idx !== randomIndex) return slot;
      const akanTerisi = slot.status === 'kosong';

      // Simulasi pembacaan baru tiap kali status berubah
      const jarakBaru = Math.round((Math.random() * 2 + 0.3) * 10) / 10; // 0.3m - 2.3m
      const suhuBaru = Math.round(Math.random() * 4 + 27); // 27 - 31 C
      const kelembapanBaru = Math.round(Math.random() * 12 + 56); // 56% - 68%

      return {
        ...slot,
        status: akanTerisi ? 'terisi' : 'kosong',
        ultrasonikMasuk: akanTerisi ? 'terdeteksi' : 'kosong',
        proximity: akanTerisi ? 'terdeteksi' : 'kosong',
        jarakTembokMeter: jarakBaru,
        suhuCelsius: suhuBaru,
        kelembapanPersen: kelembapanBaru,
      };
    });
    callback(DUMMY_SLOTS);
  }, 6000);

  return () => clearInterval(interval);
}

/**
 * Ambil info tarif & kuota harian dari MockAPI (Anggota 2 - Axios).
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


export async function getParkingHistory() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: 'h1', slotId: 'A2', aksi: 'masuk', waktu: '08:12', suhuCelsius: 30, jarakTembokMeter: 0.7, kelembapanPersen: 58 },
    { id: 'h2', slotId: 'B1', aksi: 'masuk', waktu: '08:30', suhuCelsius: 28, jarakTembokMeter: 1.4, kelembapanPersen: 63 },
    { id: 'h3', slotId: 'A1', aksi: 'keluar', waktu: '07:55', suhuCelsius: 29, jarakTembokMeter: 1.9, kelembapanPersen: 62 },
  ];
}

/**
 * 
 *
 * @param {(entry: object) => void} onNewEntry dipanggil setiap kali ada entri baru
 * @returns {() => void} unsubscribe function
 */
export function subscribeParkingHistory(onNewEntry) {
  const interval = setInterval(() => {
    const randomSlot = DUMMY_SLOTS[Math.floor(Math.random() * DUMMY_SLOTS.length)];
    const now = new Date();
    const waktu = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
 
    const entry = {
      id: `live-${now.getTime()}`,
      slotId: randomSlot.id,
      aksi: randomSlot.status === 'terisi' ? 'masuk' : 'keluar',
      waktu,
      suhuCelsius: randomSlot.suhuCelsius,
      jarakTembokMeter: randomSlot.jarakTembokMeter,
      kelembapanPersen: randomSlot.kelembapanPersen,
      isLive: true, // flag penanda entri ini datang dari rekap live, bukan histori awal
    };

    onNewEntry(entry);
  }, 5000);

  return () => clearInterval(interval);
}


