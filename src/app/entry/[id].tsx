import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Share, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing, type ThemeColors } from '@/constants/theme';
import { entries } from '@/data/entries';
import { getHistoricalFormula } from '@/data/historical-formulas';
import { communityLabels, regionLabels } from '@/data/labels';
import { plantImages } from '@/data/plant-images';
import { photoCredits } from '@/data/photo-credits';
import { getPlantStateRange } from '@/data/plant-state-ranges';
import type { HistoricalFormula } from '@/types';

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
  const historicalFormula = getHistoricalFormula(entry.id);
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
      historicalFormula
        ? '\nSource status: The measured formula has a cited primary source; that source does not automatically verify every broader archive claim.'
        : '\nSource status: A record-level historical citation was not available in the project files for independent review.',
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
        ) : (
          <View style={[styles.noPhoto, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.noPhotoGlyph, { color: colors.accent }]}>❦</Text>
            <View style={styles.noPhotoCopy}>
              <Text style={[styles.noPhotoLabel, { color: colors.textSecondary }]}>NO VERIFIED IMAGE AVAILABLE</Text>
              <Text style={[styles.noPhotoText, { color: colors.text }]}>
                An accurate, reusable image could not be independently verified for this record. No substitute image was used.
              </Text>
            </View>
          </View>
        )}

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

        <View style={[styles.sourceStatus, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
          <Text selectable style={[styles.sourceStatusLabel, { color: colors.textSecondary }]}>ARCHIVE SOURCE STATUS</Text>
          <Text selectable style={[styles.sourceStatusText, { color: historicalFormula ? colors.accent : colors.ochre }]}>
            {historicalFormula
              ? 'A measured historical formula is supported by the cited period source below. That citation verifies the formula only; its Source Fit note explains which broader claims remain unverified.'
              : entry.confirmed
                ? 'A record-level historical citation was not present in the available project files, so the narrative could not be independently reproduced claim by claim. It is retained as an archive lead, not proof of safety or effectiveness.'
                : 'This record could not be independently verified from the available project materials. It is retained at the owner’s direction and is not evidence of safety or effectiveness.'}
          </Text>
        </View>

        {entry.note ? (
          <View style={[styles.storyCard, { backgroundColor: colors.backgroundElement, borderColor: colors.accent }]}>
            <Text style={[styles.storyGlyph, { color: colors.accent }]}>❦</Text>
            <Text style={[styles.story, { color: colors.text, fontFamily: Fonts?.serif }]}>{entry.note}</Text>
          </View>
        ) : null}

        <Field label="Tradition" value={entry.people} colors={colors} />
        <Field label="Used for" value={entry.use} colors={colors} />
        {entry.method ? <Field label="How it was made" value={entry.method} colors={colors} /> : null}
        {historicalFormula ? <HistoricalFormulaBlock formula={historicalFormula} colors={colors} /> : null}
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

function HistoricalFormulaBlock({ formula, colors }: { formula: HistoricalFormula; colors: ThemeColors }) {
  return (
    <View style={[styles.formulaCard, { borderColor: colors.accent, backgroundColor: colors.backgroundElement }]}>
      <Text selectable style={[styles.formulaEyebrow, { color: colors.accent }]}>DOCUMENTED HISTORICAL FORMULA</Text>
      <Text selectable style={[styles.formulaTitle, { color: colors.text, fontFamily: Fonts?.serif }]}>{formula.title}</Text>
      <Text selectable style={[styles.formulaDisclaimer, { color: colors.textSecondary }]}>
        How this preparation was recorded in the cited period source. This is not a recommendation or treatment instruction.
      </Text>

      <Text selectable style={[styles.formulaSectionLabel, { color: colors.textSecondary }]}>MEASURED INGREDIENTS · PERIOD UNITS</Text>
      <View style={styles.ingredientList}>
        {formula.ingredients.map((ingredient) => (
          <View key={`${ingredient.amount}-${ingredient.item}`} style={[styles.ingredientRow, { borderColor: colors.border }]}>
            <Text selectable style={[styles.ingredientAmount, { color: colors.accent }]}>{ingredient.amount}</Text>
            <Text selectable style={[styles.ingredientItem, { color: colors.text }]}>{ingredient.item}</Text>
          </View>
        ))}
      </View>

      <Text selectable style={[styles.formulaSectionLabel, { color: colors.textSecondary }]}>HOW THE SOURCE RECORDED IT</Text>
      <View style={styles.formulaSteps}>
        {formula.recorded_method.map((step, index) => (
          <View key={step} style={styles.formulaStep}>
            <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
              <Text selectable style={[styles.stepNumberText, { color: colors.accentText }]}>{index + 1}</Text>
            </View>
            <Text selectable style={[styles.formulaStepText, { color: colors.text }]}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.sourceFitBox, { borderColor: colors.border }]}>
        <Text selectable style={[styles.sourceFitLabel, { color: colors.textSecondary }]}>WHAT THE SOURCE VERIFIES</Text>
        <Text selectable style={[styles.sourceFitText, { color: colors.text }]}>{formula.source_fit}</Text>
        <Text selectable style={[styles.archiveNote, { color: colors.textSecondary }]}>{formula.archive_note}</Text>
      </View>

      <View style={[styles.formulaSafety, { borderColor: colors.ochre }]}>
        <Text selectable style={[styles.formulaSafetyLabel, { color: colors.ochre }]}>MODERN SAFETY NOTES</Text>
        {formula.safety_notes.map((note) => (
          <Text selectable key={note} style={[styles.formulaSafetyText, { color: colors.text }]}>• {note}</Text>
        ))}
      </View>

      <Text selectable style={[styles.formulaSectionLabel, { color: colors.textSecondary }]}>PRIMARY HISTORICAL SOURCE</Text>
      <Text selectable style={[styles.sourceCitation, { color: colors.text }]}>
        {formula.primary_source.author}. {formula.primary_source.title} ({formula.primary_source.publication_year}), p. {formula.primary_source.page}.
      </Text>
      <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(formula.primary_source.url)}>
        <Text selectable style={[styles.formulaLink, { color: colors.accent }]}>Open the digitized historical source</Text>
      </Pressable>

      <Text selectable style={[styles.formulaSectionLabel, { color: colors.textSecondary }]}>MODERN SAFETY SOURCES</Text>
      {formula.safety_sources.map((source) => (
        <Pressable key={source.url} accessibilityRole="link" onPress={() => void Linking.openURL(source.url)}>
          <Text selectable style={[styles.formulaLink, { color: colors.accent }]}>{source.publisher}: {source.title}</Text>
        </Pressable>
      ))}
    </View>
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
    <View style={[styles.field, { borderColor: colors.accent, backgroundColor: colors.backgroundElement }]}>
      <Text style={[styles.fieldLabel, { color: colors.accent }]}>{label}</Text>
      <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.three, paddingBottom: 48, gap: 4 },
  image: { width: '100%', aspectRatio: 4 / 3, borderRadius: 10, marginBottom: 8 },
  noPhoto: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  noPhotoGlyph: { fontSize: 34 },
  noPhotoCopy: { maxWidth: 300, gap: 6, alignItems: 'center' },
  noPhotoLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, textAlign: 'center' },
  noPhotoText: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
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
  sourceStatus: { borderWidth: 1, borderRadius: 8, padding: 11, marginTop: 8, marginBottom: 2, gap: 4 },
  sourceStatusLabel: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.8 },
  sourceStatusText: { fontSize: 11.5, lineHeight: 17, fontWeight: '600' },
  field: {
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    gap: 4,
  },
  fieldLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
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
  formulaCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
    gap: 8,
  },
  formulaEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  formulaTitle: { fontSize: 21, lineHeight: 27, fontWeight: '700' },
  formulaDisclaimer: { fontSize: 12.5, lineHeight: 18 },
  formulaSectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.9, marginTop: 8 },
  ingredientList: { gap: 0 },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 7,
  },
  ingredientAmount: { width: 112, fontSize: 13, lineHeight: 18, fontWeight: '700' },
  ingredientItem: { flex: 1, fontSize: 14, lineHeight: 20 },
  formulaSteps: { gap: 10 },
  formulaStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepNumber: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 11, fontWeight: '800', fontVariant: ['tabular-nums'] },
  formulaStepText: { flex: 1, fontSize: 14, lineHeight: 20 },
  sourceFitBox: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, gap: 4 },
  sourceFitLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.9 },
  sourceFitText: { fontSize: 12.5, lineHeight: 18 },
  archiveNote: { fontSize: 11.5, lineHeight: 17, fontStyle: 'italic' },
  formulaSafety: { borderWidth: 1, borderRadius: 9, padding: 11, gap: 5 },
  formulaSafetyLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.9 },
  formulaSafetyText: { fontSize: 12.5, lineHeight: 18 },
  sourceCitation: { fontSize: 12.5, lineHeight: 18 },
  formulaLink: { fontSize: 12.5, lineHeight: 18, fontWeight: '700' },
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
