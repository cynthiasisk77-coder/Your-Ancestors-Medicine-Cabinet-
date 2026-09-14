import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
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
      <View style={styles.scroll}>
        <Text style={[styles.heading, { color: colors.text, fontFamily: Fonts?.serif }]}>
          Where remedies come from
        </Text>
        <Text style={[styles.dek, { color: colors.textSecondary }]}>
          Tap a place on the map to see what people there reached for.
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
                  <Text style={[styles.tileLabel, { color: colors.text, fontFamily: Fonts?.serif }]} numberOfLines={2}>
                    {regionLabels[region]}
                  </Text>
                  <Text style={[styles.tileCount, { color: colors.accent }]}>
                    {counts[region] ?? 0} {counts[region] === 1 ? 'story' : 'stories'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1, padding: Spacing.three, justifyContent: 'center', gap: Spacing.two },
  heading: { fontSize: 22, fontWeight: '700' },
  dek: { fontSize: 13, lineHeight: 18, marginBottom: Spacing.two },
  grid: { width: '100%', position: 'relative' },
  tile: { position: 'absolute', padding: 4 },
  tileInner: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  tileLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  tileCount: { fontSize: 10, marginTop: 2 },
});
