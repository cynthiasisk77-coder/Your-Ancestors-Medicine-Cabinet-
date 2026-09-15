import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { entries } from '@/data/entries';
import { regionLabels, regionOrder, stateLabels } from '@/data/labels';
import type { Region } from '@/types';

type StateRow = { code: string | null; label: string; count: number };

export default function StatesScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const groups = useMemo(() => {
    const byRegion: Record<Region, Record<string, number>> = {} as Record<Region, Record<string, number>>;
    for (const region of regionOrder) byRegion[region] = {};

    for (const e of entries) {
      const key = e.state ?? '__unspecified';
      byRegion[e.region][key] = (byRegion[e.region][key] ?? 0) + 1;
    }

    return regionOrder
      .map((region) => {
        const counts = byRegion[region];
        const rows: StateRow[] = Object.entries(counts)
          .filter(([code]) => code !== '__unspecified')
          .map(([code, count]) => ({ code, label: stateLabels[code] ?? code, count }))
          .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

        const unspecified = counts['__unspecified'] ?? 0;
        if (unspecified > 0) {
          rows.push({ code: null, label: 'Other / spans multiple states', count: unspecified });
        }

        const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
        return { region, total, rows };
      })
      .filter((g) => g.total > 0);
  }, []);

  const openState = (region: Region, code: string | null) => {
    if (code) {
      router.push({ pathname: '/(tabs)', params: { state: code } });
    } else {
      router.push({ pathname: '/(tabs)', params: { region } });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.text, fontFamily: Fonts?.serif }]}>
          Where remedies come from
        </Text>
        <Text style={[styles.dek, { color: colors.textSecondary }]}>
          Tap a state to see what people there reached for.
        </Text>
      </View>

      <ScrollView
        style={[styles.body, { backgroundColor: colors.bodyBackground, borderTopColor: colors.accent }]}
        contentContainerStyle={styles.scroll}>
        {groups.map((group) => (
          <View key={group.region} style={styles.group}>
            <Text style={[styles.groupTitle, { color: colors.accent, fontFamily: Fonts?.serif }]}>
              {regionLabels[group.region]}
            </Text>
            <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              {group.rows.map((row, i) => (
                <Pressable
                  key={row.code ?? 'unspecified'}
                  onPress={() => openState(group.region, row.code)}
                  style={[
                    styles.row,
                    i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.backgroundSelected },
                  ]}>
                  <Text
                    style={[
                      styles.rowLabel,
                      { color: row.code ? colors.text : colors.textSecondary },
                      !row.code && { fontStyle: 'italic' },
                    ]}>
                    {row.label}
                  </Text>
                  <View style={[styles.countPill, { backgroundColor: colors.background }]}>
                    <Text style={[styles.countText, { color: colors.accent }]}>{row.count}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.three, paddingBottom: Spacing.two },
  body: { flex: 1, borderTopWidth: 3 },
  scroll: { padding: Spacing.three, paddingBottom: 48 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  dek: { fontSize: 13, lineHeight: 18 },
  group: { marginBottom: Spacing.four },
  groupTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  rowLabel: { fontSize: 15, flexShrink: 1, paddingRight: 8 },
  countPill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, minWidth: 34, alignItems: 'center' },
  countText: { fontSize: 12.5, fontWeight: '700' },
});
