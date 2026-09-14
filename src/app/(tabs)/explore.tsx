import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { entries } from '@/data/entries';
import { regionGridPosition, regionLabels, regionOrder } from '@/data/labels';
import type { Region } from '@/types';

const COLS = 5;
const ROWS = 4;

export default function RegionsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const counts = useMemo(() => {
    const c: Partial<Record<Region, number>> = {};
    for (const e of entries) c[e.region] = (c[e.region] ?? 0) + 1;
    return c;
  }, []);

  const openRegion = (region: Region) => {
    router.push({ pathname: '/(tabs)', params: { region } });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.dek, { color: colors.textSecondary }]}>
          Tap a region to see what people there reached for. Positions are a rough layout, not a
          precise map.
        </Text>

        <View style={[styles.grid, { aspectRatio: COLS / ROWS }]}>
          {regionOrder.map((region) => {
            const pos = regionGridPosition[region];
            return (
              <Pressable
                key={region}
                onPress={() => openRegion(region)}
                style={[
                  styles.tile,
                  {
                    left: `${(pos.col / COLS) * 100}%`,
                    top: `${(pos.row / ROWS) * 100}%`,
                    width: `${(1 / COLS) * 100}%`,
                    height: `${(1 / ROWS) * 100}%`,
                  },
                ]}>
                <View style={[styles.tileInner, { backgroundColor: colors.backgroundElement, borderColor: colors.accent }]}>
                  <Text style={[styles.tileLabel, { color: colors.text }]} numberOfLines={2}>
                    {regionLabels[region]}
                  </Text>
                  <Text style={[styles.tileCount, { color: colors.accent }]}>
                    {counts[region] ?? 0}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: Fonts?.serif }]}>
          All regions
        </Text>
        {regionOrder.map((region) => (
          <Pressable
            key={region}
            onPress={() => openRegion(region)}
            style={[styles.row, { borderColor: colors.backgroundSelected }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{regionLabels[region]}</Text>
            <Text style={[styles.rowCount, { color: colors.textSecondary }]}>
              {counts[region] ?? 0} entries
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.three, gap: Spacing.three, paddingBottom: 48 },
  dek: { fontSize: 13, lineHeight: 18 },
  grid: { width: '100%', position: 'relative' },
  tile: { position: 'absolute', padding: 3 },
  tileInner: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  tileLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  tileCount: { fontSize: 10, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: { fontSize: 14.5 },
  rowCount: { fontSize: 13 },
});
