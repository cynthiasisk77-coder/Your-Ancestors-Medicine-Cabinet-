import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Share, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing, type ThemeColors } from '@/constants/theme';
import { entries } from '@/data/entries';
import { communityLabels, regionLabels } from '@/data/labels';
import { plantImages } from '@/data/plant-images';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const a = colors;

  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, padding: Spacing.three }}>Entry not found.</Text>
      </SafeAreaView>
    );
  }

  const image = entry.img ? plantImages[entry.img.value] : null;
  const dangerous = !entry.confirmed && !!entry.caution;

  const onShare = () => {
    const lines = [
      entry.name + (entry.sci ? ` (${entry.sci})` : ''),
      '',
      `Tradition: ${entry.people}`,
      `Used for: ${entry.use}`,
      entry.method ? `How it was made: ${entry.method}` : null,
      entry.note ? `\n${entry.note}` : null,
      entry.caution ? `\nCAUTION: ${entry.caution}` : null,
      '',
      'From Roots & Remedies — a historical archive of American folk medicine.',
    ].filter(Boolean);
    Share.share({ message: lines.join('\n') });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: entry.name }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {image ? <Image source={image} style={styles.image} contentFit="cover" /> : null}

        {!entry.confirmed && (
          <View style={[styles.badge, { borderColor: dangerous ? a.rust : a.ochre }]}>
            <Text style={[styles.badgeText, { color: dangerous ? a.rust : a.ochre }]}>
              {dangerous ? 'UNCONFIRMED · DO NOT USE' : 'UNCONFIRMED · RESEARCH LEAD'}
            </Text>
          </View>
        )}

        <View style={styles.tags}>
          <Text style={[styles.tag, { color: a.indigo }]}>{communityLabels[entry.community]}</Text>
          <Text style={{ color: colors.textSecondary }}> · </Text>
          <Text style={[styles.tag, { color: a.ochre }]}>{regionLabels[entry.region]}</Text>
        </View>

        <Text style={[styles.name, { color: colors.text, fontFamily: Fonts?.serif }]}>{entry.name}</Text>
        {entry.sci ? <Text style={[styles.sci, { color: colors.textSecondary }]}>{entry.sci}</Text> : null}

        <Field label="Tradition" value={entry.people} colors={colors} />
        <Field label="Used for" value={entry.use} colors={colors} />
        {entry.method ? <Field label="How it was made" value={entry.method} colors={colors} /> : null}
        {entry.note ? (
          <View style={[styles.noteBox, { borderColor: colors.backgroundSelected }]}>
            <Text style={[styles.note, { color: colors.textSecondary }]}>{entry.note}</Text>
          </View>
        ) : null}
        {entry.caution ? (
          <View style={[styles.cautionBox, { borderColor: a.rust }]}>
            <Text style={[styles.cautionLabel, { color: a.rust }]}>CAUTION</Text>
            <Text style={[styles.caution, { color: colors.text }]}>{entry.caution}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={onShare}
          style={[styles.shareButton, { backgroundColor: colors.accent }]}>
          <Text style={[styles.shareButtonText, { color: colors.accentText }]}>Share this remedy</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, colors }: { label: string; value: string; colors: ThemeColors }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.three, paddingBottom: 48, gap: 4 },
  image: { width: '100%', aspectRatio: 4 / 3, borderRadius: 10, marginBottom: 8 },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeText: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.5 },
  tags: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' },
  tag: { fontSize: 12, fontWeight: '600' },
  name: { fontSize: 28, fontWeight: '700', marginTop: 6 },
  sci: { fontSize: 15, fontStyle: 'italic', marginBottom: 8 },
  field: { marginTop: 14 },
  fieldLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  fieldValue: { fontSize: 15, lineHeight: 21 },
  noteBox: { borderLeftWidth: 2, paddingLeft: 10, marginTop: 16 },
  note: { fontSize: 13.5, fontStyle: 'italic', lineHeight: 19 },
  cautionBox: { borderWidth: 1, borderRadius: 8, padding: 12, marginTop: 16 },
  cautionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  caution: { fontSize: 13.5, lineHeight: 19 },
  shareButton: {
    marginTop: 28,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareButtonText: { fontSize: 15, fontWeight: '600' },
});
