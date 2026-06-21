// screens/ProfileScreens.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function ProfileScreens({ navigation }) {
  const user = auth.currentUser;
  const email = user?.email || 'pengguna@parkirin.app';
  const initial = email.charAt(0).toUpperCase();

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar dari ParkirIn?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <View style={styles.avatarBlock}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.role}>Operator ParkirIn</Text>
      </View>

      <View style={styles.infoCard}>
        <InfoRow label="Status Akun" value="Aktif" />
        <InfoRow label="Area Akses" value="A & B" />
        <InfoRow label="Sumber Sensor" value="Ultrasonik · Proximity Induktif" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
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
  avatarBlock: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#2DD4BF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0B1220',
  },
  email: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
  },
  role: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#141B2D',
    borderRadius: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#202B42',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#202B42',
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  infoValue: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '600',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
});
