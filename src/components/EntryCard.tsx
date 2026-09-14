import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { communityLabels, regionLabels } from '@/data/labels';
import { plantImages } from '@/data/plant-images';
import { Colors, Spacing } from '@/constants/theme';
import type { Entry } from '@/types';

const palette = {
  light: { card: '#F6F2E6', border: 'rgba(38,42,30,0.18)', ink: '#262A1E', muted: '#5b5942', forest: '#3E5C3B', ochre: '#8C6A24', rust: '#8B3A2B' },
  dark: { card: '#262E1F', border: 'rgba(237,232,216,0.20)', ink: '#EDE8D8', muted: '#B9B39A', forest: '#93B884', ochre: '#D9AD5E', rust: '#E08469' },
};

export function EntryCard({ entry }: { entry: Entry }) {
  const scheme = useColorScheme();
  const p = palette[scheme === 'dark' ? 'dark' : 'light'];
  const image = entry.img ? plantImages[entry.img.value] : null;
  const dangerous = !entry.confirmed && !!entry.caution;

  return (
    <Link href={{ pathname: '/entry/[id]', params: { id: entry.id } }} asChild>
      <Pressable
        style={[
          styles.card,
          { backgroundColor: p.card, borderColor: dangerous ? p.rust : entry.confirmed ? p.border : p.ochre },
          !entry.confirmed && styles.cardUnconfirmed,
        ]}>
        {image ? <Image source={image} style={styles.image} contentFit="cover" /> : null}
        {!entry.confirmed && (
          <View style={[styles.badge, { borderColor: dangerous ? p.rust : p.ochre }]}>
            <Text style={[styles.badgeText, { color: dangerous ? p.rust : p.ochre }]}>
              {dangerous ? 'UNCONFIRMED · DO NOT USE' : 'UNCONFIRMED · LEAD'}
            </Text>
          </View>
        )}
        <View style={styles.tags}>
          <Text style={[styles.tag, { color: '#33427A' }]} numberOfLines={1}>
            {communityLabels[entry.community]}
          </Text>
          <Text style={[styles.tagSep, { color: p.muted }]}>·</Text>
          <Text style={[styles.tag, { color: p.ochre }]}>{regionLabels[entry.region]}</Text>
        </View>
        <Text style={[styles.name, { color: p.ink }]}>{entry.name}</Text>
        {entry.sci ? <Text style={[styles.sci, { color: p.muted }]}>{entry.sci}</Text> : null}
        <Text style={[styles.use, { color: p.ink }]} numberOfLines={2}>
          {entry.use}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.three,
    margin: Spacing.two / 2,
    gap: 6,
  },
  cardUnconfirmed: {
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 9, letterSpacing: 0.5, fontWeight: '600' },
  tags: { flexDirection: 'row', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' },
  tag: { fontSize: 10, fontWeight: '600' },
  tagSep: { fontSize: 10 },
  name: { fontSize: 16, fontWeight: '700' },
  sci: { fontSize: 12, fontStyle: 'italic' },
  use: { fontSize: 13 },
});
