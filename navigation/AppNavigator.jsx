// navigation/AppNavigator.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreens from '../screens/LoginScreens';
import DashboardScreens from '../screens/DashboardScreens';
import HistoryScreens from '../screens/HistoryScreens';
import ProfileScreens from '../screens/ProfileScreens';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Warna ini disamakan dengan palet yang sudah dipakai di semua screen
// (lihat StyleSheet di DashboardScreens.jsx / HistoryScreens.jsx / ProfileScreens.jsx)
const COLORS = {
  background: '#0B1220',
  card: '#141B2D',
  border: '#202B42',
  accent: '#2DD4BF',
  textMuted: '#94A3B8',
  textBright: '#F1F5F9',
};

const TAB_ICONS = {
  Dashboard: { active: 'grid', inactive: 'grid-outline' },
  History: { active: 'time', inactive: 'time-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

/**
 * Bottom Tab Navigator: Dashboard, History, Profile.
 * Ini ditempatkan SATU level di dalam RootStack dengan nama route 'Dashboard',
 * supaya LoginScreens.jsx (yang memanggil navigation.replace('Dashboard'))
 * tidak perlu diubah sama sekali — ia tetap menuju ke seluruh grup Tab ini.
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icon = TAB_ICONS[route.name];
          const iconName = focused ? icon.active : icon.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreens} options={{ title: 'Denah' }} />
      <Tab.Screen name="History" component={HistoryScreens} options={{ title: 'Riwayat' }} />
      <Tab.Screen name="Profile" component={ProfileScreens} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

/**
 * Root Stack: Login (layar penuh, tanpa tab) -> MainTabs (Dashboard/History/Profile).
 *
 * CATATAN PENTING soal logout dari ProfileScreens.jsx:
 * ProfileScreens berada DI DALAM Tab Navigator (nested), sedangkan route 'Login'
 * didaftarkan di Stack Navigator level atas (parent). Di React Navigation,
 * navigation.replace('Login') yang dipanggil dari dalam nested navigator HANYA
 * akan mencari route 'Login' di level Tab itu sendiri dulu — yang tidak ada di
 * sana — sehingga akan menyebabkan error di runtime.
 *
 * Solusinya: gunakan `id="RootStack"` pada RootStack.Navigator, lalu di
 * ProfileScreens.jsx panggil:
 *   navigation.getParent('RootStack')?.replace('Login')
 * Ini langsung menavigasi ke Stack root, alih-alih mencari 'Login' di Tab.
 * (Lihat catatan di bawah file ini untuk patch satu baris di ProfileScreens.jsx)
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Login" component={LoginScreens} />
        <RootStack.Screen name="Dashboard" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
