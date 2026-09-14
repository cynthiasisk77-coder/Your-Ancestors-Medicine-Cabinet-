import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { entries } from '@/data/entries';
import { communityLabels, communityOrder } from '@/data/labels';
import type { Community } from '@/types';

export default function TraditionsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const counts = useMemo(() => {
    const c: Partial<Record<Community, number>> = {};
    for (const e of entries) c[e.community] = (c[e.community] ?? 0) + 1;
    return c;
  }, []);

  const openTradition = (community: Community) => {
    router.push({ pathname: '/(tabs)', params: { community } });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.dek, { color: colors.textSecondary }]}>
          Tap a tradition to see what that community reached for.
        </Text>

        {communityOrder.map((community) => (
          <Pressable
            key={community}
            onPress={() => openTradition(community)}
            style={[styles.row, { borderColor: colors.backgroundSelected }]}>
            <Text style={[styles.rowLabel, { color: colors.text, fontFamily: Fonts?.serif }]}>
              {communityLabels[community]}
            </Text>
            <View style={[styles.countPill, { backgroundColor: colors.backgroundElement }]}>
              <Text style={[styles.countText, { color: colors.accent }]}>{counts[community] ?? 0}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.three, paddingBottom: 48 },
  dek: { fontSize: 13, lineHeight: 18, marginBottom: Spacing.three },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: { fontSize: 16, flexShrink: 1, paddingRight: 8 },
  countPill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, minWidth: 34, alignItems: 'center' },
  countText: { fontSize: 12.5, fontWeight: '700' },
});
