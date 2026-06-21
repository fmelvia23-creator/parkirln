// services/firebaseConfig.js
// Konfigurasi Firebase untuk ParkirIn
// Auth dipakai di LoginScreens.jsx, Realtime Database dipakai untuk status slot real-time
// (sensor ultrasonik/VL53L0X mengirim data ke sini saat Firebase sudah siap).

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAgEKBx-LfFHwH_3HMaBtUsbrBIx6TNScI',
  authDomain: 'parkirln.firebaseapp.com',
  projectId: 'parkirln',
  storageBucket: 'parkirln.firebasestorage.app',
  messagingSenderId: '155932729490',
  appId: '1:155932729490:web:4af9dc22b72a9a295b864b',
  // databaseURL belum diisi -- akan ditambahkan setelah Realtime Database diaktifkan
  // di Firebase Console (Build > Realtime Database > Create Database).
  // Bentuknya nanti seperti:
  // databaseURL: 'https://parkirln-default-rtdb.asia-southeast1.firebasedatabase.app',
};

// Hindari init ulang saat hot-reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;