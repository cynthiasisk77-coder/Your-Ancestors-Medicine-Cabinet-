import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, useRouter } from 'expo-router';
import { Image, Pressable, Text, View, useColorScheme } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const isDark = scheme === 'dark';
  const router = useRouter();

  const SearchHeaderButton = () => (
    <Pressable
      onPress={() => router.navigate({ pathname: '/', params: { reset: String(Date.now()) } })}
      accessibilityRole="button"
      accessibilityLabel="Search remedies"
      hitSlop={12}
      style={{ paddingHorizontal: 14, paddingTop: 6 }}>
      <Text style={{ fontSize: 20 }}>🔍</Text>
    </Pressable>
  );

  const HeaderBackground = () => (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={isDark ? [colors.headerBackground, '#151d10'] : ['#C3D9AE', colors.headerBackground]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          borderBottomWidth: 2,
          borderBottomColor: colors.accent,
          borderTopWidth: 1,
          borderTopColor: colors.ochre,
          opacity: isDark ? 0.7 : 0.55,
        }}
      />
    </View>
  );

  const HeaderTitle = ({ label, tagline }: { label: string; tagline?: string }) => (
    <View style={{ alignItems: 'center', maxWidth: '100%' }}>
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
      {tagline ? (
        <Text
          style={{
            fontFamily: Fonts?.serif,
            fontStyle: 'italic',
            fontSize: 11,
            color: colors.textSecondary,
            marginTop: 1,
          }}
          numberOfLines={1}>
          {tagline}
        </Text>
      ) : null}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerBackground: HeaderBackground,
        headerStyle: { height: 68 },
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
          headerTitle: () => <HeaderTitle label="The Forgotten Remedy Cabinet" tagline="Real household remedies, 1600s–1900s" />,
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
          title: 'States',
          tabBarLabel: 'States',
          headerTitle: () => <HeaderTitle label="States" />,
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
