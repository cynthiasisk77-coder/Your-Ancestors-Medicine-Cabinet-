import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryCard } from '@/components/EntryCard';
import { Colors, Spacing, type ThemeColors } from '@/constants/theme';
import { entries } from '@/data/entries';
import { communityLabels, communityOrder, regionLabels, regionOrder } from '@/data/labels';
import type { Community, Region } from '@/types';

export default function BrowseScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const params = useLocalSearchParams<{ region?: string }>();

  const [search, setSearch] = useState('');
  const [community, setCommunity] = useState<Community | 'all'>('all');
  const [region, setRegion] = useState<Region | 'all'>('all');
  const [showUnconfirmed, setShowUnconfirmed] = useState(true);

  useEffect(() => {
    if (params.region && regionOrder.includes(params.region as Region)) {
      setRegion(params.region as Region);
    }
  }, [params.region]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((e) => {
      if (community !== 'all' && e.community !== community) return false;
      if (region !== 'all' && e.region !== region) return false;
      if (!showUnconfirmed && !e.confirmed) return false;
      if (q) {
        const hay = `${e.name} ${e.use} ${e.people} ${e.sci ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [search, community, region, showUnconfirmed]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <View style={styles.controls}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search a remedy, ailment, or people…"
          placeholderTextColor={colors.textSecondary}
          style={[styles.search, { color: colors.text, backgroundColor: colors.backgroundElement }]}
        />
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {filtered.length} of {entries.length}
        </Text>

        <ChipRow
          label="Who"
          active={community}
          onChange={setCommunity}
          items={communityOrder}
          labels={communityLabels}
          colors={colors}
        />
        <ChipRow
          label="Where"
          active={region}
          onChange={setRegion}
          items={regionOrder}
          labels={regionLabels}
          colors={colors}
        />

        <Pressable style={styles.toggleRow} onPress={() => setShowUnconfirmed((v) => !v)}>
          <Switch value={showUnconfirmed} onValueChange={setShowUnconfirmed} />
          <Text style={[styles.toggleLabel, { color: colors.textSecondary }]}>
            Include unconfirmed research leads
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        key="grid-2"
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <EntryCard entry={item} />}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            Nothing matches that search.
          </Text>
        }
        removeClippedSubviews
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={7}
      />
    </SafeAreaView>
  );
}

function ChipRow<T extends string>({
  label,
  active,
  onChange,
  items,
  labels,
  colors,
}: {
  label: string;
  active: T | 'all';
  onChange: (v: T | 'all') => void;
  items: T[];
  labels: Record<T, string>;
  colors: ThemeColors;
}) {
  return (
    <View style={styles.chipRow}>
      <Text style={[styles.chipLabel, { color: colors.textSecondary }]}>{label}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={['all' as const, ...items]}
        keyExtractor={(v) => v}
        contentContainerStyle={{ gap: 6 }}
        renderItem={({ item }) => {
          const isActive = active === item;
          const text = item === 'all' ? 'All' : labels[item];
          return (
            <Pressable
              onPress={() => onChange(item)}
              style={[
                styles.chip,
                { borderColor: colors.backgroundSelected },
                isActive && { backgroundColor: colors.text, borderColor: colors.text },
              ]}>
              <Text style={[styles.chipText, { color: isActive ? colors.background : colors.text }]}>
                {text}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, gap: 8 },
  search: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  count: { fontSize: 11, alignSelf: 'flex-end' },
  chipRow: { gap: 4 },
  chipLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontSize: 12.5 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2, marginBottom: 4 },
  toggleLabel: { fontSize: 12.5, flexShrink: 1 },
  grid: { paddingHorizontal: Spacing.two, paddingBottom: 32, paddingTop: 8 },
  empty: { textAlign: 'center', marginTop: 48, fontStyle: 'italic' },
});
