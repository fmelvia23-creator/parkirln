// screens/LoginScreens.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function LoginScreens({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email dan kata sandi wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Nama route Stack root adalah 'Main' (lihat AppNavigator.jsx),
      // bukan 'Dashboard' -- supaya tidak duplikat dengan Tab.Screen
      // name="Dashboard" di dalam MainTabs.
      navigation.replace('Main');
    } catch (error) {
      const message = mapFirebaseError(error?.code);
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.brandBlock}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>P</Text>
        </View>
        <Text style={styles.title}>ParkirIn</Text>
        <Text style={styles.subtitle}>Smart Mini-Parking Slot</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="nama@kampus.ac.id"
          placeholderTextColor="#5B6478"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Kata Sandi</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#5B6478"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0B1220" />
          ) : (
            <Text style={styles.loginButtonText}>Masuk</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        Sensor ultrasonik & proximity induktif terhubung otomatis setelah masuk
      </Text>
    </KeyboardAvoidingView>
  );
}

function mapFirebaseError(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Format email tidak valid.';
    case 'auth/user-not-found':
      return 'Akun tidak ditemukan.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email atau kata sandi salah.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan. Coba lagi beberapa saat.';
    default:
      return 'Gagal masuk. Periksa koneksi dan coba lagi.';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2DD4BF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0B1220',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F1F5F9',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  formCard: {
    backgroundColor: '#141B2D',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#202B42',
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#0B1220',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F1F5F9',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#202B42',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 12,
  },
  loginButton: {
    backgroundColor: '#2DD4BF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#0B1220',
    fontSize: 15,
    fontWeight: '700',
  },
  footerText: {
    color: '#5B6478',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 12,
  },
});
