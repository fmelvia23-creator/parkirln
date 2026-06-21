// screens/HistoryScreens.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getParkingHistory, subscribeParkingHistory } from '../services/sensorApi';

const JARAK_AMAN_METER = 1;

// 1. Array statis untuk mengunci urutan render (Selalu A1 -> B5)
const SLOT_IDS = ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5'];

export default function HistoryScreens() {
  // Menyimpan data dalam bentuk Object agar mudah ditimpa berdasarkan ID Slot
  const [slotsData, setSlotsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Load snapshot riwayat awal
    getParkingHistory().then((data) => {
      if (!isMounted) return;
      
      const initialData = {};
      // Memasukkan data awal ke dalam object dengan key slotId
      data.forEach(entry => {
        if (!initialData[entry.slotId]) {
          initialData[entry.slotId] = entry;
        }
      });
      
      setSlotsData(initialData);
      setLoading(false);
    });

    // Live feed update per 5 detik
    const unsubscribe = subscribeParkingHistory((entry) => {
      if (!isMounted) return;
      
      setSlotsData((prevData) => ({
        ...prevData,
        [entry.slotId]: { ...entry, isLive: true } // Menimpa data spesifik pada slotId yang bersangkutan
      }));
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2DD4BF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Riwayat Slot</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Rekap pembacaan sensor urut A1 - B5</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {/* 2. Selalu me-render tepat 10 kotak berdasarkan SLOT_IDS yang sudah diurutkan */}
        {SLOT_IDS.map((id) => {
          // Jika belum ada data untuk slot ini, buat kerangka kosongnya
          const item = slotsData[id] || { 
            slotId: id, waktu: '-', suhuCelsius: '-', kelembapanPersen: '-', jarakTembokMeter: '-', aksi: null 
          };
          
          return <HistoryRow key={id} item={item} />;
        })}
      </ScrollView>
    </View>
  );
}

function HistoryRow({ item }) {
  const isMasuk = item.aksi === 'masuk';
  const belumAdaData = item.waktu === '-';
  const terlaluDekat = typeof item.jarakTembokMeter === 'number' && item.jarakTembokMeter < JARAK_AMAN_METER;

  return (
    <View style={styles.row}>
      
      {/* KOTAK KIRI: Nama Slot & Status Aksi */}
      <View style={styles.leftBox}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={[styles.iconBadge, belumAdaData ? styles.iconBadgeKosong : (isMasuk ? styles.iconBadgeMasuk : styles.iconBadgeKeluar)]}>
            <Text style={styles.iconBadgeText}>
              {belumAdaData ? '-' : (isMasuk ? '↓' : '↑')}
            </Text>
          </View>
          <View>
            <View style={styles.rowTitleLine}>
              <Text style={styles.rowSlot}>Slot {item.slotId}</Text>
              {item.isLive && <View style={styles.liveTag} />}
            </View>
            <Text style={styles.rowAksi}>
              {belumAdaData ? 'Menunggu...' : `Kendaraan ${isMasuk ? 'masuk' : 'keluar'}`}
            </Text>
          </View>
        </View>
      </View>

      {/* KOTAK KANAN: Rekap Pembacaan Sensor */}
      <View style={styles.rightBox}>
        <View style={styles.metaBadge}>
          <Ionicons name="thermometer-outline" size={12} color="#94A3B8" />
          <Text style={styles.metaBadgeText}>{item.suhuCelsius !== '-' ? `${item.suhuCelsius}°C` : '-'}</Text>
        </View>
        
        <View style={styles.metaBadge}>
          <Ionicons name="water-outline" size={12} color="#94A3B8" />
          <Text style={styles.metaBadgeText}>{item.kelembapanPersen !== '-' ? `${item.kelembapanPersen}%` : '-'}</Text>
        </View>
        
        <View style={[styles.metaBadge, terlaluDekat && styles.metaBadgeWarning]}>
          <Ionicons name="resize-outline" size={12} color={terlaluDekat ? '#F59E0B' : '#94A3B8'} />
          <Text style={[styles.metaBadgeText, terlaluDekat && styles.metaBadgeTextWarning]}>
            {item.jarakTembokMeter !== '-' ? `${Number(item.jarakTembokMeter).toFixed(1)}m` : '-'}
          </Text>
        </View>

        <Text style={styles.rowWaktu}>{item.waktu}</Text>
      </View>
    </View>
  );
}

// 3. Styling yang sebelumnya hilang di bagian bawah
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220' },
  loadingContainer: { flex: 1, backgroundColor: '#0B1220', alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#F1F5F9' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(239, 68, 68, 0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  liveBadgeText: { color: '#EF4444', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  list: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#141B2D', borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#202B42', gap: 10 },
  leftBox: { flex: 1.2 },
  rightBox: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  iconBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iconBadgeMasuk: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  iconBadgeKeluar: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  iconBadgeKosong: { backgroundColor: 'rgba(148, 163, 184, 0.15)' },
  iconBadgeText: { color: '#F1F5F9', fontSize: 16, fontWeight: '700' },
  rowTitleLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowSlot: { color: '#F1F5F9', fontSize: 15, fontWeight: '700' },
  liveTag: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2DD4BF' },
  rowAksi: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(148, 163, 184, 0.12)', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
  metaBadgeWarning: { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  metaBadgeText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  metaBadgeTextWarning: { color: '#F59E0B' },
  rowWaktu: { color: '#5B6478', fontSize: 11, fontFamily: 'monospace', marginLeft: 4 },
});