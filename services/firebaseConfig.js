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

};

// Hindari init ulang saat hot-reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;