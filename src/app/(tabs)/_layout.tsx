import { Tabs, useRouter } from 'expo-router';
import { Image, Pressable, Text, View, useColorScheme } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const SearchHeaderButton = () => (
    <Pressable
      onPress={() => router.push('/(tabs)')}
      hitSlop={12}
      style={{ paddingHorizontal: 14 }}>
      <Text style={{ fontSize: 20 }}>🔍</Text>
    </Pressable>
  );

  const HeaderTitle = ({ label }: { label: string }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, maxWidth: '100%' }}>
      <Text style={{ fontSize: 13, opacity: 0.6 }}>🌿</Text>
      <Text
        style={{
          fontFamily: Fonts?.serif,
          fontWeight: '700',
          fontSize: 19,
          letterSpacing: 0.2,
          color: colors.text,
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.75}>
        {label}
      </Text>
      <Text style={{ fontSize: 13, opacity: 0.6 }}>🌿</Text>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.headerBackground,
          borderBottomWidth: 2,
          borderBottomColor: colors.accent,
        },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.bodyBackground,
          borderTopWidth: 1.5,
          borderTopColor: colors.accent,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'The Forgotten Remedy Cabinet',
          tabBarLabel: 'Browse',
          headerTitle: () => <HeaderTitle label="The Forgotten Remedy Cabinet" />,
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
          headerTitle: () => <HeaderTitle label="Regions" />,
          headerRight: SearchHeaderButton,
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
          headerTitle: () => <HeaderTitle label="Traditions" />,
          headerRight: SearchHeaderButton,
          tabBarIcon: ({ size }) => <Text style={{ fontSize: size }}>🌿</Text>,
        }}
      />
    </Tabs>
  );
}
