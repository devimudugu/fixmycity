// app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Buffer } from 'buffer';
global.Buffer = global.Buffer || Buffer;



export default function TabsLayout() {
  const {user} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(!user) {
      router.replace('/login')
    }
  },[user]);
  if(!user) return null;
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'home') iconName = 'home-outline';
          else if (route.name === 'report') iconName = 'alert-circle-outline';
          else if (route.name === 'profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    />
  );
}
