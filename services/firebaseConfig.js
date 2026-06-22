// services/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Project Radahn (Yang Benar)
const firebaseConfig = {
  apiKey: "AIzaSyChP4JTIihMFPqWtmXWaxMF-5yCD-QlJo0",
  authDomain: "radahn-1aef8.firebaseapp.com",
  projectId: "radahn-1aef8",
  storageBucket: "radahn-1aef8.firebasestorage.app",
  messagingSenderId: "86364801873",
  appId: "1:86364801873:web:67be00d0cb59614621d750",
  databaseURL: "https://radahn-1aef8-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Inisialisasi Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Ekspor Service
export const auth = getAuth(app);
export const database = getDatabase(app); // Untuk Realtime Database
export const db = getFirestore(app);      // Untuk Firestore (History)

export default app;