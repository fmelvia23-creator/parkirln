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

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Login" component={LoginScreens} />
        <RootStack.Screen name="Main" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
