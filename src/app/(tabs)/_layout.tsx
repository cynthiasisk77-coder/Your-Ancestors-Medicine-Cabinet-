import { Tabs } from 'expo-router';
import { Image, Text, useColorScheme } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: Fonts?.serif },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Roots & Remedies',
          tabBarLabel: 'Browse',
          tabBarIcon: ({ size }) => (
            <Image
              source={require('@/assets/images/tabIcons/home.png')}
              style={{ width: size, height: size }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Regions',
          tabBarLabel: 'Regions',
          tabBarIcon: ({ size }) => (
            <Image
              source={require('@/assets/images/tabIcons/explore.png')}
              style={{ width: size, height: size }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="traditions"
        options={{
          title: 'Traditions',
          tabBarLabel: 'Traditions',
          tabBarIcon: ({ size }) => <Text style={{ fontSize: size }}>🌿</Text>,
        }}
      />
    </Tabs>
  );
}
