// services/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Kunci asli 100% valid dari Project Radahn Paduka
const firebaseConfig = {
  apiKey: "AIzaSyChP4JTIihMFPqWtmXWaxMF-5yCD-QlJo0", //
  authDomain: "radahn-1aef8.firebaseapp.com",        //
  projectId: "radahn-1aef8",                         //
  storageBucket: "radahn-1aef8.firebasestorage.app", //
  messagingSenderId: "86364801873",                  //
  appId: "1:86364801873:web:67be00d0cb59614621d750", //
  databaseURL: "https://radahn-1aef8-default-rtdb.asia-southeast1.firebasedatabase.app" // Otomatis mengarah ke database Radahn
};

// Hindari inisialisasi ulang saat hot-reload aplikasi
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app); // Kunci Realtime Database
export const db = getFirestore(app);       // Kunci Cloud Firestore Database

export default app;