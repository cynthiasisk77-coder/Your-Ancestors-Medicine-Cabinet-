import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { communityLabels, regionLabels } from '@/data/labels';
import { plantImages } from '@/data/plant-images';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Entry } from '@/types';

export function EntryCard({ entry, width }: { entry: Entry; width: number }) {
  const scheme = useColorScheme();
  const c = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const image = entry.img ? plantImages[entry.img.value] : null;
  const dangerous = !entry.confirmed && !!entry.caution;

  return (
    <Link href={{ pathname: '/entry/[id]', params: { id: entry.id } }} asChild>
      <Pressable
        style={[
          styles.card,
          { width, backgroundColor: c.backgroundElement, borderColor: dangerous ? c.rust : entry.confirmed ? c.accent : c.ochre },
          !entry.confirmed && styles.cardUnconfirmed,
        ]}>
        {image ? <Image source={image} style={styles.image} contentFit="cover" /> : null}
        {!entry.confirmed && (
          <View style={[styles.badge, { borderColor: dangerous ? c.rust : c.ochre }]}>
            <Text style={[styles.badgeText, { color: dangerous ? c.rust : c.ochre }]}>
              {dangerous ? 'UNCONFIRMED · DO NOT USE' : 'UNCONFIRMED · LEAD'}
            </Text>
          </View>
        )}
        <View style={styles.tags}>
          <Text style={[styles.tag, { color: c.indigo }]} numberOfLines={1}>
            {communityLabels[entry.community]}
          </Text>
          <Text style={[styles.tagSep, { color: c.textSecondary }]}>·</Text>
          <Text style={[styles.tag, { color: c.ochre }]}>{regionLabels[entry.region]}</Text>
        </View>
        <Text style={[styles.name, { color: c.text, fontFamily: Fonts?.serif }]}>{entry.name}</Text>
        {entry.sci ? <Text style={[styles.sci, { color: c.textSecondary }]}>{entry.sci}</Text> : null}
        <Text style={[styles.use, { color: c.text }]} numberOfLines={2}>
          {entry.use}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
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
