// screens/DashboardScreens.jsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { subscribeParkingSlots, getTarifDanKuota } from '../services/sensorApi';

const AREA_FILTERS = ['Semua', 'A', 'B'];

export default function DashboardScreens() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [areaFilter, setAreaFilter] = useState('Semua');
  const [tarifInfo, setTarifInfo] = useState(null);

  useEffect(() => {
    // subscribeParkingSlots mensimulasikan data sensor real-time.
    // Saat sensor ultrasonik mendeteksi mobil, callback ini akan terpanggil lagi
    // dengan status slot terbaru, dan grid otomatis berubah warna.
    const unsubscribe = subscribeParkingSlots((updatedSlots) => {
      setSlots(updatedSlots);
      setLoading(false);
    });

    getTarifDanKuota().then(setTarifInfo);

    return () => unsubscribe();
  }, []);

  const filteredSlots = useMemo(() => {
    if (areaFilter === 'Semua') return slots;
    return slots.filter((slot) => slot.area === areaFilter);
  }, [slots, areaFilter]);

  const stats = useMemo(() => {
    const total = slots.length;
    const terisi = slots.filter((s) => s.status === 'terisi').length;
    return { total, terisi, kosong: total - terisi };
  }, [slots]);

  const onRefresh = async () => {
    setRefreshing(true);
    const tarif = await getTarifDanKuota();
    setTarifInfo(tarif);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2DD4BF" />
        <Text style={styles.loadingText}>Menghubungkan ke sensor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Denah Parkir</Text>
        <Text style={styles.headerSubtitle}>
          {stats.kosong} kosong · {stats.terisi} terisi dari {stats.total} slot
        </Text>
      </View>

      {tarifInfo && (
        <View style={styles.tarifCard}>
          <View style={styles.tarifItem}>
            <Text style={styles.tarifLabel}>Tarif / Jam</Text>
            <Text style={styles.tarifValue}>Rp{tarifInfo.tarifPerJam?.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.tarifDivider} />
          <View style={styles.tarifItem}>
            <Text style={styles.tarifLabel}>Kuota Harian</Text>
            <Text style={styles.tarifValue}>
              {tarifInfo.kuotaTerpakai}/{tarifInfo.kuotaHarian}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.filterRow}>
        {AREA_FILTERS.map((area) => {
          const active = areaFilter === area;
          return (
            <TouchableOpacity
              key={area}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setAreaFilter(area)}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {area === 'Semua' ? 'Semua Area' : `Area ${area}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
          <Text style={styles.legendText}>Kosong</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>Terisi</Text>
        </View>
      </View>

      <FlatList
        data={filteredSlots}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2DD4BF" />
        }
        renderItem={({ item }) => <SlotCard slot={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tidak ada slot pada area ini.</Text>
        }
      />
    </View>
  );
}

function SlotCard({ slot }) {
  const isKosong = slot.status === 'kosong';
  return (
    <View
      style={[
        styles.slotCard,
        isKosong ? styles.slotCardKosong : styles.slotCardTerisi,
      ]}
    >
      <Text style={styles.slotId}>{slot.id}</Text>
      <Text style={[styles.slotStatus, { color: isKosong ? '#22C55E' : '#EF4444' }]}>
        {isKosong ? 'Kosong' : 'Terisi'}
      </Text>
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
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 13,
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
  tarifCard: {
    flexDirection: 'row',
    backgroundColor: '#141B2D',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#202B42',
  },
  tarifItem: {
    flex: 1,
    alignItems: 'center',
  },
  tarifDivider: {
    width: 1,
    backgroundColor: '#202B42',
    marginHorizontal: 8,
  },
  tarifLabel: {
    color: '#94A3B8',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  tarifValue: {
    color: '#2DD4BF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#141B2D',
    borderWidth: 1,
    borderColor: '#202B42',
  },
  filterChipActive: {
    backgroundColor: '#2DD4BF',
    borderColor: '#2DD4BF',
  },
  filterChipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#0B1220',
  },
  legendRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  grid: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 24,
  },
  slotCard: {
    flex: 1,
    margin: 6,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  slotCardKosong: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderColor: '#22C55E',
  },
  slotCardTerisi: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: '#EF4444',
  },
  slotId: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F1F5F9',
    fontFamily: 'monospace',
  },
  slotStatus: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  emptyText: {
    color: '#5B6478',
    textAlign: 'center',
    marginTop: 40,
  },
});
