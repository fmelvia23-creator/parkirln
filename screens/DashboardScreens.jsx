// screens/DashboardScreens.jsx
// VIP Parking System — 4 slot eksklusif.
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
import { Ionicons } from '@expo/vector-icons';
import { subscribeParkingSlots, getTarifDanKuota } from '../services/sensorApi';

const AREA_FILTERS = ['Semua', 'A', 'B'];

// Ambang batas jarak ke tembok (meter). Di bawah ini dianggap terlalu dekat.
const JARAK_AMAN_METER = 1;

export default function DashboardScreens() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [areaFilter, setAreaFilter] = useState('Semua');
  const [tarifInfo, setTarifInfo] = useState(null);

  useEffect(() => {
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
        <View style={styles.legendItem}>
          <Ionicons name="warning" size={11} color="#F59E0B" />
          <Text style={styles.legendText}>Jarak &lt; {JARAK_AMAN_METER}m</Text>
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
        {typeof kelembapan === 'number' && (
          <View style={styles.metaBadge}>
            <Ionicons name="water-outline" size={11} color="#94A3B8" />
            <Text style={styles.metaBadgeText}>{kelembapan}%</Text>
          </View>
        )}
        {typeof jarakTembok === 'number' && (
          <View style={[styles.metaBadge, terlaluDekat && styles.metaBadgeWarning]}>
            <Ionicons
              name="resize-outline"
              size={11}
              color={terlaluDekat ? '#F59E0B' : '#94A3B8'}
            />
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FBBF24',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  vipBadgeText: {
    color: '#0B1220',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
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
    gap: 14,
    flexWrap: 'wrap',
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
    minHeight: 116,
    borderRadius: 16,
    padding: 10,
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
  slotTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotId: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F1F5F9',
    fontFamily: 'monospace',
  },
  warningBadge: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotStatus: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  slotMetaRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaBadgeWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  metaBadgeText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  metaBadgeTextWarning: {
    color: '#F59E0B',
  },
  emptyText: {
    color: '#5B6478',
    textAlign: 'center',
    marginTop: 40,
  },
});
