import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BookmarkX, ArrowUpRight, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OpportunityCard } from '@/components/OpportunityCard';
import { opportunities } from '@/constants/mockData';
import { Opportunity } from '@/types/opportunity';
import { colors, spacing, borderRadius } from '@/constants/colors';

export default function SavedScreen() {
  const router = useRouter();
  const [savedIds, setSavedIds] = useState<string[]>(['1', '3', '5']);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [headerAnim]);

  const savedOpportunities = opportunities.filter((opp) =>
    savedIds.includes(opp.id)
  );

  const handleToggleSave = useCallback((id: string) => {
    setSavedIds((prev) => prev.filter((savedId) => savedId !== id));
  }, []);

  const handleOpportunityPress = useCallback((id: string) => {
    router.push(`/opportunity/${id}`);
  }, [router]);

  const renderOpportunityCard = useCallback(
    ({ item, index }: { item: Opportunity; index: number }) => (
      <OpportunityCard
        opportunity={item}
        isSaved={true}
        onPress={() => handleOpportunityPress(item.id)}
        onToggleSave={() => handleToggleSave(item.id)}
        index={index}
      />
    ),
    [handleOpportunityPress, handleToggleSave]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Saved</Text>
            <View style={styles.titleBadge}>
              <Sparkles size={14} color={colors.accent.quaternary} />
            </View>
          </View>
          <Text style={styles.subtitle}>
            {savedOpportunities.length} opportunity{savedOpportunities.length !== 1 ? 'ies' : 'y'}
          </Text>
        </View>
      </Animated.View>

      {/* Content */}
      {savedOpportunities.length > 0 ? (
        <FlatList
          data={savedOpportunities}
          renderItem={renderOpportunityCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.opportunitiesList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <BookmarkX size={40} color={colors.text.tertiary} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>No saved opportunities</Text>
          <Text style={styles.emptyDescription}>
            Browse opportunities and save the ones you are interested in. They will appear here.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)')}
            activeOpacity={0.8}
          >
            <Text style={styles.browseButtonText}>Browse Opportunities</Text>
            <ArrowUpRight size={16} color={colors.background.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  titleBadge: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  subtitle: {
    color: colors.text.tertiary,
    fontSize: 14,
    fontWeight: '500',
  },
  opportunitiesList: {
    paddingTop: spacing.sm,
    paddingBottom: 120,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  emptyTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  browseButtonText: {
    color: colors.background.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
