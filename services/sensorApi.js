import axiosInstance from './axiosInstance';
import { database } from './firebaseConfig';
import { ref, onValue, get } from 'firebase/database';

// ---------- TEMPLATE DATA (FALLBACK) ----------
const DEFAULT_SLOTS = [
  { id: 'A1', area: 'A', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 0, suhuCelsius: 0, kelembapanPersen: 0, isWarning: false },
  { id: 'A2', area: 'A', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 0, suhuCelsius: 0, kelembapanPersen: 0, isWarning: false },
  { id: 'A3', area: 'A', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 0, suhuCelsius: 0, kelembapanPersen: 0, isWarning: false },
  { id: 'A4', area: 'A', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 0, suhuCelsius: 0, kelembapanPersen: 0, isWarning: false },
  { id: 'A5', area: 'A', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 0, suhuCelsius: 0, kelembapanPersen: 0, isWarning: false },
  { id: 'B1', area: 'B', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 0, suhuCelsius: 0, kelembapanPersen: 0, isWarning: false },
  { id: 'B2', area: 'B', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 0, suhuCelsius: 0, kelembapanPersen: 0, isWarning: false },
  { id: 'B3', area: 'B', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 0, suhuCelsius: 0, kelembapanPersen: 0, isWarning: false },
  { id: 'B4', area: 'B', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 0, suhuCelsius: 0, kelembapanPersen: 0, isWarning: false },
  { id: 'B5', area: 'B', status: 'kosong', ultrasonikMasuk: 'kosong', proximity: 'kosong', jarakTembokMeter: 0, suhuCelsius: 0, kelembapanPersen: 0, isWarning: false },
];

/**
 * Menggabungkan template dasar dengan data asli dari Firebase
 */
const mapFirebaseToSlots = (firebaseData) => {
  if (!firebaseData) return DEFAULT_SLOTS;

  return DEFAULT_SLOTS.map((slot) => {
    const nodeName = `Slot_${slot.id}`;
    const dataAsli = firebaseData[nodeName];

    if (dataAsli) {
      return {
        ...slot,
        // Konversi status ke lowercase
        status: dataAsli.Status ? dataAsli.Status.toLowerCase() : 'kosong',
        // Konversi jarak dari cm ke meter (untuk UI)
        jarakTembokMeter: dataAsli.Jarak !== undefined ? (dataAsli.Jarak / 100) : 0,
        // Data Suhu
        suhuCelsius: dataAsli.Suhu || 0,
        kelembapanPersen: dataAsli.Kelembapan || 0,
        // TAMBAHAN: ambil data warning dari Firebase
        isWarning: dataAsli.Warning || false, 
      };
    }
    return slot; 
  });
};

/**
 * Ambil snapshot status slot parkir sekali.
 */
export async function getParkingSlots() {
  try {
    const parkiranRef = ref(database, 'Parkiran');
    const snapshot = await get(parkiranRef);
    return mapFirebaseToSlots(snapshot.val());
  } catch (error) {
    console.error("Gagal get data:", error);
    return DEFAULT_SLOTS;
  }
}

/**
 * Ambil detail pembacaan sensor untuk satu slot tertentu.
 */
export async function getSensorDetailBySlotId(slotId) {
  try {
    const slotRef = ref(database, `Parkiran/Slot_${slotId}`);
    const snapshot = await get(slotRef);
    const dataAsli = snapshot.val();
    
    if (dataAsli) {
      return {
        id: slotId,
        status: dataAsli.Status ? dataAsli.Status.toLowerCase() : 'kosong',
        jarakTembokMeter: dataAsli.Jarak !== undefined ? (dataAsli.Jarak / 100) : 0,
        isWarning: dataAsli.Warning || false,
      };
    }
    return null;
  } catch (error) {
    console.error("Gagal get detail:", error);
    return null;
  }
}

/**
 * KONEKSI REAL-TIME KE FIREBASE
 */
export function subscribeParkingSlots(callback) {
  const parkiranRef = ref(database, 'Parkiran');
  const unsubscribe = onValue(parkiranRef, (snapshot) => {
    const dataFirebase = snapshot.val();
    const updatedSlots = mapFirebaseToSlots(dataFirebase);
    callback(updatedSlots);
  });
  return () => unsubscribe();
}

/**
 * Ambil info tarif & kuota harian dari MockAPI
 */
export async function getTarifDanKuota() {
  try {
    const response = await axiosInstance.get('/parkir_area');
    const dataApi = response.data[0];
    return {
      tarifPerJam: dataApi.tarif_per_jam,
      kuotaHarian: dataApi.kuota_total,
      kuotaTerpakai: dataApi.kuota_terpakai,
    };
  } catch (error) {
    console.log('[sensorApi] Gagal ambil tarif, pakai fallback');
    return { tarifPerJam: 3000, kuotaHarian: 50, kuotaTerpakai: 28 };
  }
}

// History (Dummy untuk sementara agar aplikasi tidak crash)
export async function getParkingHistory() {
  return [];
}

export function subscribeParkingHistory(onNewEntry) {
  return () => {};
}