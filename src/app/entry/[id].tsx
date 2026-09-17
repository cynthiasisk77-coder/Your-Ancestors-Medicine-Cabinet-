import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Share, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing, type ThemeColors } from '@/constants/theme';
import { entries } from '@/data/entries';
import { communityLabels, regionLabels } from '@/data/labels';
import { plantImages } from '@/data/plant-images';
import { photoCredits } from '@/data/photo-credits';
import { getPlantStateRange } from '@/data/plant-state-ranges';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const a = colors;
  const [photoOpen, setPhotoOpen] = useState(false);

  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, padding: Spacing.three }}>Entry not found.</Text>
      </SafeAreaView>
    );
  }

  const image = entry.img ? plantImages[entry.img.value] : null;
  const photoCredit = entry.img ? photoCredits[entry.img.value] : undefined;
  const plantStateRange = getPlantStateRange(entry.id);
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
      !entry.confirmed ? '\nVerification: Could not be independently verified.' : null,
      '',
      'From The Forgotten Remedy Cabinet — a historical archive of American folk medicine.',
    ].filter(Boolean);
    Share.share({ message: lines.join('\n') });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: entry.name }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {image ? (
          <Pressable onPress={() => setPhotoOpen(true)}>
            <Image source={image} style={styles.image} contentFit="cover" />
            <View style={[styles.zoomHint, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
              <Text style={styles.zoomHintText}>Tap to view full-screen</Text>
            </View>
          </Pressable>
        ) : null}

        {image ? (
          <PhotoCreditBlock
            credit={photoCredit}
            colors={colors}
            onOpenSource={photoCredit?.source_page ? () => void Linking.openURL(photoCredit.source_page) : undefined}
          />
        ) : null}

        <Modal visible={photoOpen} animationType="fade" transparent onRequestClose={() => setPhotoOpen(false)}>
          <Pressable style={styles.photoModalBg} onPress={() => setPhotoOpen(false)}>
            {image ? <Image source={image} style={styles.photoModalImage} contentFit="contain" /> : null}
            <Pressable style={styles.photoModalClose} onPress={() => setPhotoOpen(false)}>
              <Text style={styles.photoModalCloseText}>✕</Text>
            </Pressable>
          </Pressable>
        </Modal>

        {!entry.confirmed && (
          <View style={[styles.badge, { borderColor: dangerous ? a.rust : a.ochre }]}>
            <Text style={[styles.badgeText, { color: dangerous ? a.rust : a.ochre }]}>
              {dangerous ? 'NOT VERIFIED · DO NOT USE' : 'COULD NOT BE INDEPENDENTLY VERIFIED'}
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

        {plantStateRange ? (
          <View style={[styles.rangeSource, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.rangeSourceLabel, { color: colors.textSecondary }]}>BOTANICAL RANGE SOURCE</Text>
            <Text style={[styles.rangeSourceText, { color: colors.text }]}>State presence verified in the USDA NRCS PLANTS Database.</Text>
            {plantStateRange.scientific_names.map((name, index) => (
              <Pressable
                key={`${name}-${plantStateRange.source_profiles[index]}`}
                accessibilityRole="link"
                onPress={() => void Linking.openURL(plantStateRange.source_profiles[index])}>
                <Text style={[styles.rangeSourceLink, { color: colors.accent }]}>USDA profile: {name}</Text>
              </Pressable>
            ))}
          </View>
        ) : entry.sci ? (
          <View style={[styles.rangeSource, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.rangeSourceLabel, { color: colors.textSecondary }]}>BOTANICAL RANGE</Text>
            <Text style={[styles.rangeUnverified, { color: colors.ochre }]}>A state-level USDA range could not be independently verified for this record, so it is not included in state search results.</Text>
          </View>
        ) : null}

        {entry.note ? (
          <View style={[styles.storyCard, { backgroundColor: colors.backgroundElement, borderColor: colors.accent }]}>
            <Text style={[styles.storyGlyph, { color: colors.accent }]}>❦</Text>
            <Text style={[styles.story, { color: colors.text, fontFamily: Fonts?.serif }]}>{entry.note}</Text>
          </View>
        ) : null}

        <Field label="Tradition" value={entry.people} colors={colors} />
        <Field label="Used for" value={entry.use} colors={colors} />
        {entry.method ? <Field label="How it was made" value={entry.method} colors={colors} /> : null}
        {entry.caution ? (
          <View style={[styles.cautionBox, { borderColor: a.rust }]}>
            <Text style={[styles.cautionLabel, { color: a.rust }]}>CAUTION</Text>
            <Text style={[styles.caution, { color: colors.text }]}>{entry.caution}</Text>
          </View>
        ) : null}

        <View
          style={[
            styles.archiveNotice,
            { borderColor: colors.border, backgroundColor: colors.backgroundElement },
          ]}>
          <Text style={[styles.archiveNoticeLabel, { color: colors.textSecondary }]}>HISTORICAL ARCHIVE</Text>
          <Text style={[styles.archiveNoticeText, { color: colors.text }]}>
            {'These records preserve historical practices. They are not medical advice or instructions for treatment.'}
          </Text>
        </View>

        <Pressable
          onPress={onShare}
          style={[styles.shareButton, { backgroundColor: colors.accent }]}>
          <Text style={[styles.shareButtonText, { color: colors.accentText }]}>Share this remedy</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function PhotoCreditBlock({
  credit,
  colors,
  onOpenSource,
}: {
  credit: (typeof photoCredits)[string] | undefined;
  colors: ThemeColors;
  onOpenSource?: () => void;
}) {
  const verified = credit?.verification_status === 'verified_from_wikimedia_manifest';

  return (
    <View style={[styles.photoCredit, { borderColor: colors.border }]}>
      <Text style={[styles.photoCreditLabel, { color: colors.textSecondary }]}>PHOTO CREDIT</Text>
      {verified && credit ? (
        <>
          <Text style={[styles.photoCreditText, { color: colors.text }]}>
            {credit.creator || 'Creator not stated'} · {credit.license || 'License not stated'}
          </Text>
          {credit.notes ? (
            <Text style={[styles.photoCreditNote, { color: colors.textSecondary }]}>{credit.notes}</Text>
          ) : null}
          {onOpenSource ? (
            <Pressable accessibilityRole="link" onPress={onOpenSource}>
              <Text style={[styles.photoCreditLink, { color: colors.accent }]}>View source and license details</Text>
            </Pressable>
          ) : null}
        </>
      ) : (
        <Text style={[styles.photoCreditUnverified, { color: colors.ochre }]}>
          Photo source, creator, and license could not be independently verified. The image has been retained and clearly marked at the owner&apos;s direction.
        </Text>
      )}
    </View>
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
  zoomHint: {
    position: 'absolute',
    bottom: 16,
    right: 8,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  zoomHintText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  photoModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoModalImage: { width: '100%', height: '80%' },
  photoModalClose: {
    position: 'absolute',
    top: 56,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoModalCloseText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  photoCredit: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 10, marginBottom: 6 },
  photoCreditLabel: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.8, marginBottom: 2 },
  photoCreditText: { fontSize: 11.5, lineHeight: 16 },
  photoCreditNote: { fontSize: 10.5, lineHeight: 15, marginTop: 2 },
  photoCreditLink: { fontSize: 11.5, fontWeight: '600', marginTop: 3 },
  photoCreditUnverified: { fontSize: 11.5, lineHeight: 16, fontWeight: '600' },
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
  rangeSource: { borderWidth: 1, borderRadius: 8, padding: 10, marginTop: 6, marginBottom: 4 },
  rangeSourceLabel: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.8, marginBottom: 3 },
  rangeSourceText: { fontSize: 11.5, lineHeight: 16 },
  rangeSourceLink: { fontSize: 11.5, fontWeight: '600', marginTop: 3 },
  rangeUnverified: { fontSize: 11.5, lineHeight: 16, fontWeight: '600' },
  field: { marginTop: 14 },
  fieldLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  fieldValue: { fontSize: 15, lineHeight: 21 },
  storyCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    marginBottom: 4,
  },
  storyGlyph: { fontSize: 20, marginBottom: 4 },
  story: { fontSize: 16, lineHeight: 24 },
  cautionBox: { borderWidth: 1, borderRadius: 8, padding: 12, marginTop: 16 },
  cautionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  caution: { fontSize: 13.5, lineHeight: 19 },
  archiveNotice: { borderWidth: 1, borderRadius: 8, padding: 12, marginTop: 16 },
  archiveNoticeLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  archiveNoticeText: { fontSize: 12.5, lineHeight: 18 },
  shareButton: {
    marginTop: 28,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareButtonText: { fontSize: 15, fontWeight: '600' },
});
