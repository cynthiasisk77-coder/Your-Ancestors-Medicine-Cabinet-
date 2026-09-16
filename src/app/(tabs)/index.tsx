import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryCard } from '@/components/EntryCard';
import { Colors, Fonts, Spacing, type ThemeColors } from '@/constants/theme';
import { entries } from '@/data/entries';
import { communityLabels, communityOrder, regionLabels, regionOrder, stateLabels } from '@/data/labels';
import type { Community, Region } from '@/types';

const GRID_GAP = Spacing.two;
const CARD_MARGIN = Spacing.two / 2;

export default function BrowseScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const params = useLocalSearchParams<{ region?: string; community?: string; state?: string; reset?: string }>();
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = (windowWidth - GRID_GAP * 2 - CARD_MARGIN * 4) / 2;

  const [search, setSearch] = useState('');
  const [community, setCommunity] = useState<Community | 'all'>('all');
  const [region, setRegion] = useState<Region | 'all'>('all');
  const [stateFilter, setStateFilter] = useState<string | 'all'>('all');
  const [showUnconfirmed, setShowUnconfirmed] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (params.region && regionOrder.includes(params.region as Region)) {
      setRegion(params.region as Region);
    }
  }, [params.region]);

  useEffect(() => {
    if (params.community && communityOrder.includes(params.community as Community)) {
      setCommunity(params.community as Community);
    }
  }, [params.community]);

  useEffect(() => {
    if (params.state && params.state in stateLabels) {
      setStateFilter(params.state);
    }
  }, [params.state]);

  // The header search button sends a fresh `reset` value on every tap (even if
  // already on this screen), so a filter picked up from the States or
  // Traditions tab doesn't silently keep narrowing results afterward.
  useEffect(() => {
    if (params.reset) {
      setCommunity('all');
      setRegion('all');
      setStateFilter('all');
    }
  }, [params.reset]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries
      .filter((e) => {
        if (community !== 'all' && e.community !== community) return false;
        if (region !== 'all' && e.region !== region) return false;
        if (stateFilter !== 'all' && !e.state.includes(stateFilter)) return false;
        if (!showUnconfirmed && !e.confirmed) return false;
        if (q) {
          const hay = `${e.name} ${e.use} ${e.people} ${e.sci ?? ''}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { ignorePunctuation: true, sensitivity: 'base' }));
  }, [search, community, region, stateFilter, showUnconfirmed]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <View style={styles.controls}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search a remedy, ailment, or people…"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
          autoCorrect={false}
          style={[styles.search, { color: colors.text, backgroundColor: colors.backgroundElement, borderColor: colors.accent }]}
        />
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {filtered.length} of {entries.length}
        </Text>

        {stateFilter !== 'all' ? (
          <Pressable
            onPress={() => setStateFilter('all')}
            style={[styles.stateBanner, { borderColor: colors.accent, backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.stateBannerText, { color: colors.text }]}>
              Showing {stateLabels[stateFilter] ?? stateFilter} only
            </Text>
            <Text style={[styles.stateBannerClear, { color: colors.accent }]}>✕ clear</Text>
          </Pressable>
        ) : null}

        <View style={styles.chipRow}>
          <Text style={[styles.chipLabel, { color: colors.textSecondary }]}>Tradition</Text>
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={[styles.pickerButton, { borderColor: colors.accent, backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.pickerButtonText, { color: colors.text }]}>
              {community === 'all' ? 'All traditions' : communityLabels[community]}
            </Text>
            <Text style={[styles.pickerButtonChevron, { color: colors.accent }]}>▾</Text>
          </Pressable>
        </View>

        <Modal visible={pickerOpen} animationType="slide" transparent onRequestClose={() => setPickerOpen(false)}>
          <Pressable style={styles.modalScrim} onPress={() => setPickerOpen(false)}>
            <Pressable style={[styles.modalSheet, { backgroundColor: colors.background }]} onPress={(e) => e.stopPropagation()}>
              <Text style={[styles.modalTitle, { color: colors.text, fontFamily: Fonts?.serif }]}>
                Filter by tradition
              </Text>
              <FlatList
                data={['all' as const, ...communityOrder]}
                keyExtractor={(v) => v}
                renderItem={({ item }) => {
                  const isActive = community === item;
                  const label = item === 'all' ? 'All traditions' : communityLabels[item];
                  return (
                    <Pressable
                      style={[styles.modalRow, { borderColor: colors.backgroundSelected }]}
                      onPress={() => {
                        setCommunity(item);
                        setPickerOpen(false);
                      }}>
                      <Text
                        style={[
                          styles.modalRowText,
                          { color: isActive ? colors.accent : colors.text, fontWeight: isActive ? '700' : '400' },
                        ]}>
                        {label}
                      </Text>
                      {isActive ? <Text style={{ color: colors.accent }}>✓</Text> : null}
                    </Pressable>
                  );
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>

        <ChipRow
          label="Region"
          active={region}
          onChange={setRegion}
          items={regionOrder}
          labels={regionLabels}
          colors={colors}
        />

        <Pressable style={styles.toggleRow} onPress={() => setShowUnconfirmed((v) => !v)}>
          <Switch
            value={showUnconfirmed}
            onValueChange={setShowUnconfirmed}
            trackColor={{ true: colors.accent }}
          />
          <Text style={[styles.toggleLabel, { color: colors.textSecondary }]}>
            Also show unresearched leads ({entries.filter((e) => !e.confirmed).length} not yet
            written up)
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        key="grid-2"
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={[styles.gridBody, { backgroundColor: colors.bodyBackground, borderTopColor: colors.accent }]}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <EntryCard entry={item} width={cardWidth} />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            Nothing matches that search.
          </Text>
        }
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
                isActive && { backgroundColor: colors.accent, borderColor: colors.accent },
              ]}>
              <Text style={[styles.chipText, { color: isActive ? colors.accentText : colors.text }]}>
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
  controls: { paddingHorizontal: Spacing.three, paddingTop: 3, paddingBottom: 6, gap: 4 },
  search: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
    fontSize: 14,
  },
  count: { fontSize: 10, alignSelf: 'flex-end' },
  stateBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stateBannerText: { fontSize: 12.5, fontWeight: '600' },
  stateBannerClear: { fontSize: 12, fontWeight: '700' },
  chipRow: { gap: 3 },
  chipLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipText: { fontSize: 12.5 },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  pickerButtonText: { fontSize: 14.5, fontWeight: '600' },
  pickerButtonChevron: { fontSize: 14, marginLeft: 8 },
  modalScrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { maxHeight: '75%', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: Spacing.three },
  modalTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: Spacing.three, marginBottom: 6 },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalRowText: { fontSize: 15 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 0, marginBottom: 0 },
  toggleLabel: { fontSize: 12, flexShrink: 1 },
  gridBody: { flex: 1, borderTopWidth: 3 },
  grid: { paddingHorizontal: Spacing.two, paddingBottom: 32, paddingTop: 10 },
  empty: { textAlign: 'center', marginTop: 48, fontStyle: 'italic' },
});
