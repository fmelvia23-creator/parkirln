<<<<<<< HEAD
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
=======
// services/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
>>>>>>> c3eeb23617823a9ce27f43f74f228961e98efc5b

// Kunci asli 100% valid dari Project Radahn Paduka
const firebaseConfig = {
<<<<<<< HEAD
  apiKey: 'AIzaSyAgEKBx-LfFHwH_3HMaBtUsbrBIx6TNScI',
  authDomain: 'parkirln.firebaseapp.com',
  projectId: 'parkirln',
  storageBucket: 'parkirln.firebasestorage.app',
  messagingSenderId: '155932729490',
  appId: '1:155932729490:web:4af9dc22b72a9a295b864b',

=======
  apiKey: "AIzaSyChP4JTIIhMFPqWtmXWaxMF-5yCD-QlJo0", //
  authDomain: "radahn-1aef8.firebaseapp.com",        //
  projectId: "radahn-1aef8",                         //
  storageBucket: "radahn-1aef8.firebasestorage.app", //
  messagingSenderId: "86364801873",                  //
  appId: "1:86364801873:web:67be00d0cb59614621d750", //
  databaseURL: "https://radahn-1aef8-default-rtdb.asia-southeast1.firebasedatabase.app" // Otomatis mengarah ke database Radahn
>>>>>>> c3eeb23617823a9ce27f43f74f228961e98efc5b
};

// Hindari inisialisasi ulang saat hot-reload aplikasi
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app); // Kunci Realtime Database
export const db = getFirestore(app);       // Kunci Cloud Firestore Database

export default app;