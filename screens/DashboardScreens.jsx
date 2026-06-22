// screens/DashboardScreens.jsx
<<<<<<< HEAD
// VIP Parking System — 4 slot eksklusif.
=======
>>>>>>> c3eeb23617823a9ce27f43f74f228961e98efc5b
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { subscribeParkingSlots, subscribeParkingHistory, getTarifDanKuota } from '../services/sensorApi';

const AREA_FILTERS = ['Semua', 'A', 'B'];
const JARAK_AMAN_METER = 1;

export default function DashboardScreens() {
  const [slots, setSlots] = useState([]);
  const [history, setHistory] = useState([]); // State baru buat history
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [areaFilter, setAreaFilter] = useState('Semua');
  const [tarifInfo, setTarifInfo] = useState(null);

  useEffect(() => {
    // 1. Subscribe ke Slot (RTDB)
    const unsubSlots = subscribeParkingSlots((updatedSlots) => {
      setSlots(updatedSlots);
      setLoading(false);
    });

    // 2. Subscribe ke History (Firestore)
    const unsubHistory = subscribeParkingHistory((newEntry) => {
      setHistory((prev) => [newEntry, ...prev].slice(0, 5)); // Ambil 5 data terbaru
    });

    getTarifDanKuota().then(setTarifInfo);

    return () => {
      unsubSlots();
      unsubHistory();
    };
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
    <ScrollView 
        style={styles.container}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2DD4BF" />
        }
    >
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>VIP Parking</Text>
          <View style={styles.vipBadge}>
            <Ionicons name="diamond" size={12} color="#0B1220" />
            <Text style={styles.vipBadgeText}>VIP</Text>
          </View>
        </View>
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

      {/* Grid Slot */}
      <View style={styles.gridContainer}>
        {filteredSlots.map((item) => <SlotCard key={item.id} slot={item} />)}
      </View>

      {/* Bagian History Firestore */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>History Sensor (Live)</Text>
        {history.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada data history.</Text>
        ) : (
            history.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                    <Text style={styles.historyTime}>{item.waktu}</Text>
                    <Text style={styles.historyText}>
                        Slot {item.slotId} <Text style={{fontWeight: 'bold', color: item.aksi === 'masuk' ? '#22C55E' : '#EF4444'}}>{item.aksi.toUpperCase()}</Text>
                    </Text>
                </View>
            ))
        )}
      </View>
    </ScrollView>
  );
}

function SlotCard({ slot }) {
  const isKosong = slot.status === 'kosong';
  const jarakTembok = slot.jarakTembokMeter;
  const terlaluDekat = typeof jarakTembok === 'number' && jarakTembok < JARAK_AMAN_METER;
  const suhu = slot.suhuCelsius;
  const kelembapan = slot.kelembapanPersen;

  return (
    <View
      style={[
        styles.slotCard,
        isKosong ? styles.slotCardKosong : styles.slotCardTerisi,
      ]}
    >
      <View style={styles.slotTopRow}>
        <Text style={styles.slotId}>{slot.id}</Text>
        {terlaluDekat && (
          <View style={styles.warningBadge}>
            <Ionicons name="warning" size={11} color="#F59E0B" />
          </View>
        )}
      </View>

      <Text style={[styles.slotStatus, { color: isKosong ? '#22C55E' : '#EF4444' }]}>
        {isKosong ? 'Kosong' : 'Terisi'}
      </Text>

      <View style={styles.slotMetaRow}>
        {typeof suhu === 'number' && (
          <View style={styles.metaBadge}>
            <Ionicons name="thermometer-outline" size={11} color="#94A3B8" />
            <Text style={styles.metaBadgeText}>{suhu}°C</Text>
          </View>
        )}
        {typeof jarakTembok === 'number' && (
          <View style={[styles.metaBadge, terlaluDekat && styles.metaBadgeWarning]}>
            <Text style={[styles.metaBadgeText, terlaluDekat && styles.metaBadgeTextWarning]}>
              {jarakTembok.toFixed(1)}m
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220' },
  loadingContainer: { flex: 1, backgroundColor: '#0B1220', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#94A3B8', marginTop: 12, fontSize: 13 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#F1F5F9' },
  vipBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#FBBF24', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  vipBadgeText: { color: '#0B1220', fontSize: 10, fontWeight: '800' },
  headerSubtitle: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  tarifCard: { flexDirection: 'row', backgroundColor: '#141B2D', borderRadius: 16, marginHorizontal: 20, padding: 16, borderWidth: 1, borderColor: '#202B42' },
  tarifItem: { flex: 1, alignItems: 'center' },
  tarifDivider: { width: 1, backgroundColor: '#202B42', marginHorizontal: 8 },
  tarifLabel: { color: '#94A3B8', fontSize: 11 },
  tarifValue: { color: '#2DD4BF', fontSize: 16, fontWeight: '700', marginTop: 4 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 16, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: '#141B2D', borderWidth: 1, borderColor: '#202B42' },
  filterChipActive: { backgroundColor: '#2DD4BF', borderColor: '#2DD4BF' },
  filterChipText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  filterChipTextActive: { color: '#0B1220' },
  legendRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 16, gap: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#94A3B8', fontSize: 12 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  slotCard: { width: '30%', margin: '1.6%', minHeight: 116, borderRadius: 16, padding: 10, borderWidth: 1.5 },
  slotCardKosong: { backgroundColor: 'rgba(34, 197, 94, 0.08)', borderColor: '#22C55E' },
  slotCardTerisi: { backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: '#EF4444' },
  slotTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  slotId: { fontSize: 17, fontWeight: '800', color: '#F1F5F9', fontFamily: 'monospace' },
  warningBadge: { width: 20, height: 20, borderRadius: 6, backgroundColor: 'rgba(245, 158, 11, 0.15)', alignItems: 'center', justifyContent: 'center' },
  slotStatus: { fontSize: 11, fontWeight: '700', marginTop: 6 },
  slotMetaRow: { flexDirection: 'row', gap: 4, marginTop: 8, flexWrap: 'wrap' },
  metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(148, 163, 184, 0.12)', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8 },
  metaBadgeText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  historySection: { padding: 20, marginBottom: 40 },
  sectionTitle: { color: '#F1F5F9', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  historyItem: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#202B42' },
  historyTime: { color: '#94A3B8', width: 80 },
  historyText: { color: '#F1F5F9', flex: 1 },
  emptyText: { color: '#5B6478', fontStyle: 'italic' }
});