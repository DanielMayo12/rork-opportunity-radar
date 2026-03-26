import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Users,
  CheckCircle2,
  ExternalLink,
  Share2,
  ChevronRight,
  AlertTriangle,
  Zap,
  Calendar,
  Lightbulb,
  Play,
} from 'lucide-react-native';
import { opportunities } from '@/constants/mockData';
import { colors, spacing, borderRadius, shadows } from '@/constants/colors';
import { RiskLevel } from '@/types/opportunity';

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return colors.status.success;
    case 'intermediate': return colors.status.warning;
    case 'advanced': return colors.status.error;
    default: return colors.text.secondary;
  }
};

const getDifficultyBgColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return colors.status.successBg;
    case 'intermediate': return colors.status.warningBg;
    case 'advanced': return colors.status.errorBg;
    default: return colors.background.elevated;
  }
};

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'low': return colors.status.success;
    case 'medium': return colors.status.warning;
    case 'high': return colors.status.error;
    default: return colors.text.secondary;
  }
};

const getRiskBgColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'low': return colors.status.successBg;
    case 'medium': return colors.status.warningBg;
    case 'high': return colors.status.errorBg;
    default: return colors.background.elevated;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'online-business': return '🌐';
    case 'side-hustle': return '💼';
    case 'reselling': return '🔄';
    case 'investing': return '📈';
    case 'local-demand': return '📍';
    case 'trending': return '🔥';
    case 'ai-opportunities': return '🤖';
    case 'freelancing': return '💻';
    case 'trending-products': return '🛍️';
    default: return '💡';
  }
};

const getCategoryLabel = (category: string) => {
  return category.replace(/-/g, ' ').toUpperCase();
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'rising': return '📈';
    case 'stable': return '➡️';
    case 'declining': return '📉';
    default: return '➡️';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const opportunity = opportunities.find((o) => o.id === id);
  const [isSaved, setIsSaved] = useState(false);

  
  const scrollY = useRef(new Animated.Value(0)).current;
  const saveScaleAnim = useRef(new Animated.Value(1)).current;
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleShare = useCallback(async () => {
    if (!opportunity) return;
    try {
      await Share.share({
        message: `Check out this opportunity: ${opportunity.title} - ${opportunity.description}`,
        title: opportunity.title,
      });
    } catch {
      Alert.alert('Error', 'Failed to share opportunity');
    }
  }, [opportunity]);

  const toggleSave = useCallback(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Animated.sequence([
      Animated.timing(saveScaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(saveScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setIsSaved(!isSaved));
  }, [isSaved, saveScaleAnim]);

  if (!opportunity) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Opportunity not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Animated Header Background */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <View style={styles.animatedHeaderContent}>
          <Text style={styles.animatedHeaderTitle} numberOfLines={1}>
            {opportunity.title}
          </Text>
        </View>
      </Animated.View>

      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.text.primary} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={22} color={colors.text.primary} strokeWidth={2} />
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ scale: saveScaleAnim }] }}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleSave}
              activeOpacity={0.7}
            >
              {isSaved ? (
                <BookmarkCheck size={24} color={colors.accent.primary} strokeWidth={2} />
              ) : (
                <Bookmark size={24} color={colors.text.primary} strokeWidth={2} />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.hero, { opacity: heroOpacity }]}>
          {/* Category & Trending */}
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryIcon}>{getCategoryIcon(opportunity.category)}</Text>
              <Text style={styles.categoryText}>
                {getCategoryLabel(opportunity.category)}
              </Text>
            </View>
            {opportunity.trending && (
              <View style={styles.trendingBadge}>
                <TrendingUp size={12} color={colors.background.primary} strokeWidth={2.5} />
                <Text style={styles.trendingText}>Trending {opportunity.trendingScore}/100</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{opportunity.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{opportunity.description}</Text>
        </Animated.View>

        {/* Earning Potential Card */}
        <View style={styles.earningCard}>
          <View style={styles.earningHeader}>
            <View style={styles.earningIconContainer}>
              <DollarSign size={24} color={colors.accent.primary} strokeWidth={2.5} />
            </View>
            <Text style={styles.earningTitle}>Earning Potential</Text>
          </View>
          <View style={styles.earningAmountRow}>
            <Text style={styles.earningAmount}>
              {formatCurrency(opportunity.estimatedEarning.min)} - {formatCurrency(opportunity.estimatedEarning.max)}
            </Text>
            <Text style={styles.earningPeriod}>per {opportunity.estimatedEarning.period}</Text>
          </View>
          <View style={styles.earningDivider} />
          <View style={styles.earningStatsRow}>
            <View style={styles.earningStat}>
              <Calendar size={16} color={colors.text.tertiary} strokeWidth={2} />
              <Text style={styles.earningStatLabel}>Time to first revenue</Text>
              <Text style={styles.earningStatValue}>{opportunity.timeToFirstRevenue}</Text>
            </View>
            <View style={styles.earningStatDivider} />
            <View style={styles.earningStat}>
              <Zap size={16} color={colors.text.tertiary} strokeWidth={2} />
              <Text style={styles.earningStatLabel}>Startup cost</Text>
              <Text style={styles.earningStatValue}>
                {opportunity.startupCost.min === 0 
                  ? 'Free' 
                  : `${formatCurrency(opportunity.startupCost.min)} - ${formatCurrency(opportunity.startupCost.max)}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconBg, { backgroundColor: colors.status.infoBg }]}>
              <Target size={20} color={colors.status.info} strokeWidth={2} />
            </View>
            <Text style={styles.metricLabel}>Difficulty</Text>
            <View style={[styles.metricBadge, { backgroundColor: getDifficultyBgColor(opportunity.difficulty) }]}>
              <Text style={[styles.metricValue, { color: getDifficultyColor(opportunity.difficulty) }]}>
                {opportunity.difficulty}
              </Text>
            </View>
          </View>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconBg, { backgroundColor: colors.status.warningBg }]}>
              <Clock size={20} color={colors.status.warning} strokeWidth={2} />
            </View>
            <Text style={styles.metricLabel}>Time Commitment</Text>
            <Text style={styles.metricValueSmall}>
              {opportunity.timeCommitment.replace('-', ' ')}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconBg, { backgroundColor: getRiskBgColor(opportunity.riskLevel) }]}>
              <AlertTriangle size={20} color={getRiskColor(opportunity.riskLevel)} strokeWidth={2} />
            </View>
            <Text style={styles.metricLabel}>Risk Level</Text>
            <View style={[styles.metricBadge, { backgroundColor: getRiskBgColor(opportunity.riskLevel) }]}>
              <Text style={[styles.metricValue, { color: getRiskColor(opportunity.riskLevel) }]}>
                {opportunity.riskLevel}
              </Text>
            </View>
          </View>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconBg, { backgroundColor: colors.status.successBg }]}>
              <Users size={20} color={colors.status.success} strokeWidth={2} />
            </View>
            <Text style={styles.metricLabel}>Competition</Text>
            <Text style={[styles.metricValueSmall, { textTransform: 'capitalize' }]}>
              {opportunity.competition}
            </Text>
          </View>
        </View>

        {/* Why This Opportunity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: colors.status.warningBg }]}>
              <Lightbulb size={18} color={colors.status.warning} strokeWidth={2} />
            </View>
            <Text style={styles.sectionTitle}>Why This Opportunity</Text>
          </View>
          <View style={styles.whyCard}>
            <Text style={styles.whyText}>{opportunity.whyThisOpportunity}</Text>
          </View>
        </View>

        {/* Market Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: colors.status.successBg }]}>
              <TrendingUp size={18} color={colors.status.success} strokeWidth={2} />
            </View>
            <Text style={styles.sectionTitle}>Market Insights</Text>
          </View>
          <View style={styles.insightsCard}>
            {opportunity.keyInsights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <View style={styles.insightBullet}>
                  <CheckCircle2 size={18} color={colors.accent.primary} strokeWidth={2.5} />
                </View>
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
            <View style={styles.demandRow}>
              <Text style={styles.demandLabel}>Demand Trend:</Text>
              <Text style={styles.demandValue}>
                {getTrendIcon(opportunity.demandTrend)} {opportunity.demandTrend}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Plan */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: colors.status.infoBg }]}>
              <Zap size={18} color={colors.status.info} strokeWidth={2} />
            </View>
            <Text style={styles.sectionTitle}>Action Plan</Text>
          </View>
          <View style={styles.stepsCard}>
            {opportunity.steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: colors.accent.quaternaryGlow }]}>
              <ExternalLink size={18} color={colors.accent.quaternary} strokeWidth={2} />
            </View>
            <Text style={styles.sectionTitle}>Helpful Resources</Text>
          </View>
          <View style={styles.resourcesCard}>
            {opportunity.resources.map((resource, index) => (
              <TouchableOpacity key={index} style={styles.resourceItem} activeOpacity={0.7}>
                <View style={styles.resourceIcon}>
                  <Text style={styles.resourceIconText}>
                    {resource.type === 'article' && '📄'}
                    {resource.type === 'video' && '🎥'}
                    {resource.type === 'tool' && '🛠️'}
                    {resource.type === 'platform' && '🌐'}
                  </Text>
                </View>
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceType}>{resource.type}</Text>
                </View>
                <ChevronRight size={18} color={colors.text.tertiary} strokeWidth={2} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagsSection}>
          {opportunity.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Animated.View style={{ transform: [{ scale: saveScaleAnim }] }}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={toggleSave}
            activeOpacity={0.7}
          >
            {isSaved ? (
              <BookmarkCheck size={22} color={colors.accent.primary} strokeWidth={2} />
            ) : (
              <Bookmark size={22} color={colors.text.secondary} strokeWidth={2} />
            )}
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={[styles.actionButton, styles.startButton]} activeOpacity={0.8}>
          <Play size={18} color={colors.background.primary} strokeWidth={2.5} />
          <Text style={styles.startButtonText}>Get Started</Text>
          <ChevronRight size={18} color={colors.background.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingTop: spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    color: colors.background.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: colors.background.glass,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 100,
    paddingTop: 50,
    paddingBottom: spacing.sm,
  },
  animatedHeaderContent: {
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  animatedHeaderTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    zIndex: 101,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    color: colors.accent.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent.quaternary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  trendingText: {
    color: colors.background.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.md,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
  },
  earningCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  earningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  earningIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.status.successBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningTitle: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  earningAmountRow: {
    marginBottom: spacing.lg,
  },
  earningAmount: {
    color: colors.accent.primary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  earningPeriod: {
    color: colors.text.tertiary,
    fontSize: 14,
    fontWeight: '500',
  },
  earningDivider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginBottom: spacing.lg,
  },
  earningStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningStat: {
    alignItems: 'center',
    flex: 1,
  },
  earningStatDivider: {
    width: 1,
    backgroundColor: colors.border.default,
  },
  earningStatLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  earningStatValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
  },
  metricIconBg: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metricLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  metricBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  metricValueSmall: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  sectionIconBg: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  whyCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.warning,
  },
  whyText: {
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 24,
  },
  insightsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  insightBullet: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  insightText: {
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  demandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  demandLabel: {
    color: colors.text.tertiary,
    fontSize: 13,
    fontWeight: '500',
  },
  demandValue: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  stepsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    color: colors.background.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepText: {
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
  },
  resourcesCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: 'hidden',
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  resourceIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  resourceIconText: {
    fontSize: 20,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  resourceType: {
    color: colors.text.tertiary,
    fontSize: 12,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  tag: {
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  tagText: {
    color: colors.text.tertiary,
    fontSize: 13,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.glass,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    height: 56,
  },
  saveButton: {
    width: 56,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  startButton: {
    flex: 1,
    backgroundColor: colors.accent.primary,
    gap: spacing.sm,
    ...shadows.glow,
  },
  startButtonText: {
    color: colors.background.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
