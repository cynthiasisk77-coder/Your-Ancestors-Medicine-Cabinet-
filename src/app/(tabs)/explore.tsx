import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { entries } from '@/data/entries';
import { stateLabels } from '@/data/labels';
import { getPlantStateRange, plantStateRangeData } from '@/data/plant-state-ranges';

type StateRow = { code: string; label: string; count: number };

export default function StatesScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const counts: Record<string, number> = {};

    // Match the Browse screen's safe default by counting only confirmed
    // archive entries. Its "also show unverified" toggle can reveal more.
    for (const entry of entries) {
      if (!entry.confirmed) continue;
      for (const code of getPlantStateRange(entry.id)?.states ?? []) {
        counts[code] = (counts[code] ?? 0) + 1;
      }
    }

    return Object.entries(stateLabels)
      .map(([code, label]): StateRow => ({ code, label, count: counts[code] ?? 0 }))
      .filter((row) => !q || row.label.toLowerCase().includes(q) || row.code.toLowerCase().includes(q))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [search]);

  const openState = (code: string) => {
    router.navigate({ pathname: '/', params: { state: code } });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.text, fontFamily: Fonts?.serif }]}>Plants by state</Text>
        <Text style={[styles.dek, { color: colors.textSecondary }]}>Search a state to find plants USDA records there.</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search states…"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
          autoCorrect={false}
          style={[
            styles.search,
            { color: colors.text, backgroundColor: colors.backgroundElement, borderColor: colors.accent },
          ]}
        />
      </View>

      <ScrollView
        style={[styles.body, { backgroundColor: colors.bodyBackground, borderTopColor: colors.accent }]}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <View style={[styles.sourceCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
          <Text style={[styles.sourceTitle, { color: colors.text }]}>Verified botanical range</Text>
          <Text style={[styles.sourceText, { color: colors.textSecondary }]}>
            Counts use exact scientific-name matches and state distribution records from the USDA NRCS PLANTS
            Database. Missing records are not guessed.
          </Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => void Linking.openURL(plantStateRangeData.metadata.source_url)}>
            <Text style={[styles.sourceLink, { color: colors.accent }]}>View USDA PLANTS source</Text>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
          {rows.map((row, index) => (
            <Pressable
              key={row.code}
              accessibilityRole="button"
              accessibilityLabel={`${row.label}, ${row.count} matching remedies`}
              disabled={row.count === 0}
              onPress={() => openState(row.code)}
              style={[
                styles.row,
                index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.backgroundSelected },
                row.count === 0 && styles.disabledRow,
              ]}>
              <View style={styles.rowCopy}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>{row.label}</Text>
                <Text style={[styles.rowCode, { color: colors.textSecondary }]}>{row.code}</Text>
              </View>
              <View style={[styles.countPill, { backgroundColor: colors.background }]}>
                <Text style={[styles.countText, { color: colors.accent }]}>{row.count}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {rows.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>No state matches that search.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.three, paddingBottom: Spacing.two, gap: 6 },
  body: { flex: 1, borderTopWidth: 3 },
  scroll: { padding: Spacing.three, paddingBottom: 48 },
  heading: { fontSize: 20, fontWeight: '700' },
  dek: { fontSize: 13, lineHeight: 18 },
  search: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, fontSize: 14 },
  sourceCard: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: Spacing.three },
  sourceTitle: { fontSize: 13, fontWeight: '700', marginBottom: 3 },
  sourceText: { fontSize: 11.5, lineHeight: 16 },
  sourceLink: { fontSize: 12, fontWeight: '700', marginTop: 6 },
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  disabledRow: { opacity: 0.45 },
  rowCopy: { flex: 1, paddingRight: 8 },
  rowLabel: { fontSize: 15 },
  rowCode: { fontSize: 10.5, marginTop: 1 },
  countPill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, minWidth: 42, alignItems: 'center' },
  countText: { fontSize: 12.5, fontWeight: '700' },
  empty: { fontSize: 14, textAlign: 'center', marginTop: Spacing.four },
});
