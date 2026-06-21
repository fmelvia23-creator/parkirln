// services/sensorService.js
import { db } from './firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const pushSensorData = async (slotId, jarak, status) => {
  try {
    await addDoc(collection(db, "sensor_history"), {
      slotId: slotId,
      jarak: jarak,
      status: status,
      timestamp: serverTimestamp()
    });
    console.log("Data berhasil masuk Firestore");
  } catch (error) {
    console.error("Gagal kirim data:", error);
  }
};