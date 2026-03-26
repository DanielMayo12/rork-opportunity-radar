import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { TrendingUp, Clock, DollarSign, Bookmark, BookmarkCheck, AlertTriangle } from 'lucide-react-native';
import { Opportunity } from '@/types/opportunity';
import { colors, spacing, borderRadius, shadows } from '@/constants/colors';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isSaved: boolean;
  onPress: () => void;
  onToggleSave: () => void;
  index?: number;
}

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

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return colors.status.success;
    case 'medium': return colors.status.warning;
    case 'high': return colors.status.error;
    default: return colors.text.secondary;
  }
};

const getRiskBgColor = (risk: string) => {
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

const getCategoryGradient = (category: string) => {
  switch (category) {
    case 'ai-opportunities': return colors.gradient.violet;
    case 'investing': return colors.gradient.emerald;
    case 'reselling': return colors.gradient.amber;
    case 'online-business': return colors.gradient.cyan;
    default: return colors.gradient.emerald;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  isSaved,
  onPress,
  onToggleSave,
  index = 0,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const saveScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const staggerDelay = (index ?? 0) * 80;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: staggerDelay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: staggerDelay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, fadeAnim, slideAnim, scaleAnim]);

  const handlePressIn = useCallback(() => {
    Animated.spring(pressAnim, {
      toValue: 0.98,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [pressAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [pressAnim]);

  const handleSavePress = useCallback(() => {
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
    ]).start(() => onToggleSave());
  }, [onToggleSave, saveScaleAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: Animated.multiply(scaleAnim, pressAnim) },
          ],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <View style={styles.card}>
          {/* Gradient Accent Bar */}
          <View style={styles.accentBar}>
            <View style={[styles.accentBarFill, { backgroundColor: getCategoryGradient(opportunity.category)[1] }]} />
          </View>

          {/* Trending Badge */}
          {opportunity.trending && (
            <View style={styles.trendingBadge}>
              <TrendingUp size={12} color={colors.background.primary} strokeWidth={2.5} />
              <Text style={styles.trendingText}>Trending</Text>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.categoryRow}>
              <View style={styles.categoryIconContainer}>
                <Text style={styles.categoryIcon}>{getCategoryIcon(opportunity.category)}</Text>
              </View>
              <Text style={styles.categoryText}>
                {opportunity.category.replace(/-/g, ' ').toUpperCase()}
              </Text>
            </View>
            <Animated.View style={{ transform: [{ scale: saveScaleAnim }] }}>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleSavePress();
                }}
                style={styles.saveButton}
                activeOpacity={0.7}
              >
                {isSaved ? (
                  <BookmarkCheck size={22} color={colors.accent.primary} />
                ) : (
                  <Bookmark size={22} color={colors.text.tertiary} />
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {opportunity.title}
          </Text>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>
            {opportunity.description}
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <View style={styles.statIconContainer}>
                <DollarSign size={14} color={colors.accent.primary} strokeWidth={2.5} />
              </View>
              <Text style={styles.statText}>
                {formatCurrency(opportunity.estimatedEarning.min)}-{formatCurrency(opportunity.estimatedEarning.max)}
              </Text>
              <Text style={styles.statPeriod}>/{opportunity.estimatedEarning.period}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <View style={styles.statIconContainer}>
                <Clock size={14} color={colors.accent.secondary} strokeWidth={2.5} />
              </View>
              <Text style={styles.statText}>
                {opportunity.timeToFirstRevenue}
              </Text>
            </View>
          </View>

          {/* Tags & Score */}
          <View style={styles.footer}>
            <View style={styles.tagsContainer}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: getDifficultyBgColor(opportunity.difficulty) },
                ]}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: getDifficultyColor(opportunity.difficulty) },
                  ]}
                />
                <Text
                  style={[
                    styles.badgeText,
                    { color: getDifficultyColor(opportunity.difficulty) },
                  ]}
                >
                  {opportunity.difficulty}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: getRiskBgColor(opportunity.riskLevel) },
                ]}
              >
                <AlertTriangle size={10} color={getRiskColor(opportunity.riskLevel)} strokeWidth={2.5} />
                <Text
                  style={[
                    styles.badgeText,
                    { color: getRiskColor(opportunity.riskLevel) },
                  ]}
                >
                  {opportunity.riskLevel}
                </Text>
              </View>
            </View>

            {/* Trending Score */}
            {opportunity.trending && (
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreValue}>{opportunity.trendingScore}</Text>
                <View style={styles.scoreBar}>
                  <View
                    style={[
                      styles.scoreFill,
                      { width: `${opportunity.trendingScore}%`, backgroundColor: getCategoryGradient(opportunity.category)[1] },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  pressable: {
    borderRadius: borderRadius.xl,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: 'hidden',
    ...shadows.md,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  accentBarFill: {
    height: '100%',
    width: '40%',
    borderBottomRightRadius: 3,
  },
  trendingBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.quaternary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
    zIndex: 1,
  },
  trendingText: {
    color: colors.background.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  saveButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.full,
  },
  title: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.sm,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  statText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  statPeriod: {
    color: colors.text.tertiary,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border.default,
    marginHorizontal: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreValue: {
    color: colors.text.tertiary,
    fontSize: 13,
    fontWeight: '700',
  },
  scoreBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.background.elevated,
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default OpportunityCard;
