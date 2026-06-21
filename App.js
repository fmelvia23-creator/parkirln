//coba coba aja

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

// 1. IMPORT FUNGSIMU DI SINI
import { getInfoParkir } from './src/services/parkingService'; 

export default function App() {

  // 2. TAMBAHKAN BLOK USE EFFECT INI UNTUK TESTING
  useEffect(() => {
    const testAxios = async () => {
      console.log("Mencoba menarik data dari API...");
      await getInfoParkir(); // Memanggil fungsimu!
    };
    
    testAxios();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Aplikasi Parkir Sedang Berjalan...</Text>
    </View>
  );
}