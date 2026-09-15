import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { entries } from '@/data/entries';
import { communityLabels } from '@/data/labels';
import type { Community } from '@/types';

const groups: { title: string; blurb: string; communities: Community[] }[] = [
  {
    title: 'Native Nations',
    blurb: 'The deepest roots — knowledge of this land that predates every other tradition here.',
    communities: ['native'],
  },
  {
    title: 'Colonial & Early Settler Households',
    blurb: 'Arriving in the 1600s–1700s and adapting fast, often by learning from Native neighbors.',
    communities: ['english', 'pagerman', 'spanish', 'french-canadian', 'appalachian'],
  },
  {
    title: 'Louisiana Creole',
    blurb: 'A distinct culture of its own — French, Spanish, African, and Indigenous knowledge woven together.',
    communities: ['creole'],
  },
  {
    title: 'African American Tradition',
    blurb: 'Knowledge carried, kept, and passed down under conditions no other group on this list faced.',
    communities: ['african'],
  },
  {
    title: '19th & Early 20th Century Immigrant Communities',
    blurb: 'Newer arrivals who brought a remedy chest from home and rebuilt it with what America offered.',
    communities: [
      'irish', 'italian', 'jewish', 'scandinavian', 'polish', 'czech-slovak', 'ukrainian',
      'volga-german', 'portuguese', 'mexican', 'chinese', 'japanese', 'filipino',
    ],
  },
];

export default function TraditionsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const counts = useMemo(() => {
    const c: Partial<Record<Community, number>> = {};
    for (const e of entries) c[e.community] = (c[e.community] ?? 0) + 1;
    return c;
  }, []);

  const openTradition = (community: Community) => {
    router.push({ pathname: '/(tabs)', params: { community } });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.text, fontFamily: Fonts?.serif }]}>
          Whose knowledge is this?
        </Text>
        <Text style={[styles.dek, { color: colors.textSecondary }]}>
          Tap a tradition to see what that community reached for, and why.
        </Text>
      </View>

      <ScrollView
        style={[styles.body, { backgroundColor: colors.bodyBackground, borderTopColor: colors.accent }]}
        contentContainerStyle={styles.scroll}>
        {groups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={[styles.groupTitle, { color: colors.accent, fontFamily: Fonts?.serif }]}>
              {group.title}
            </Text>
            <Text style={[styles.groupBlurb, { color: colors.textSecondary }]}>{group.blurb}</Text>
            <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              {group.communities.map((community, i) => (
                <Pressable
                  key={community}
                  onPress={() => openTradition(community)}
                  style={[
                    styles.row,
                    i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.backgroundSelected },
                  ]}>
                  <Text style={[styles.rowLabel, { color: colors.text }]}>{communityLabels[community]}</Text>
                  <View style={[styles.countPill, { backgroundColor: colors.background }]}>
                    <Text style={[styles.countText, { color: colors.accent }]}>{counts[community] ?? 0}</Text>
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
  groupTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  groupBlurb: { fontSize: 12.5, lineHeight: 17, fontStyle: 'italic', marginBottom: 8 },
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
