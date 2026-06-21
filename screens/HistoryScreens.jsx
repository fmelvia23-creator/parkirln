// screens/HistoryScreens.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getParkingHistory } from '../services/sensorApi';

export default function HistoryScreens() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getParkingHistory().then((data) => {
      setHistory(data);
      setLoading(false);
    });
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
        <Text style={styles.headerTitle}>Riwayat Slot</Text>
        <Text style={styles.headerSubtitle}>Log keluar-masuk hari ini</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Belum ada riwayat hari ini.</Text>}
        renderItem={({ item }) => <HistoryRow item={item} />}
      />
    </View>
  );
}

function HistoryRow({ item }) {
  const isMasuk = item.aksi === 'masuk';
  return (
    <View style={styles.row}>
      <View style={[styles.iconBadge, isMasuk ? styles.iconBadgeMasuk : styles.iconBadgeKeluar]}>
        <Text style={styles.iconBadgeText}>{isMasuk ? '↓' : '↑'}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowSlot}>Slot {item.slotId}</Text>
        <Text style={styles.rowAksi}>
          Kendaraan {isMasuk ? 'masuk' : 'keluar'}
        </Text>
      </View>
      <Text style={styles.rowWaktu}>{item.waktu}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141B2D',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#202B42',
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBadgeMasuk: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  iconBadgeKeluar: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  iconBadgeText: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
  },
  rowInfo: {
    flex: 1,
  },
  rowSlot: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '700',
  },
  rowAksi: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  rowWaktu: {
    color: '#5B6478',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  emptyText: {
    color: '#5B6478',
    textAlign: 'center',
    marginTop: 40,
  },
});
