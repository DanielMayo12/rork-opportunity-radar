import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Animated,
  TextInput,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, SlidersHorizontal, Zap, TrendingUp, Clock, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OpportunityCard } from '@/components/OpportunityCard';
import { opportunities } from '@/constants/mockData';
import { Opportunity, OpportunityCategory } from '@/types/opportunity';
import { colors, spacing, borderRadius, shadows } from '@/constants/colors';

const categories: { id: OpportunityCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'trending', label: 'Trending', icon: '📈' },
  { id: 'side-hustle', label: 'Side Hustle', icon: '💼' },
  { id: 'online-business', label: 'Online', icon: '🌐' },
  { id: 'reselling', label: 'Reselling', icon: '🔄' },
  { id: 'investing', label: 'Investing', icon: '📊' },
  { id: 'freelancing', label: 'Freelance', icon: '💻' },
  { id: 'ai-opportunities', label: 'AI', icon: '🤖' },
  { id: 'trending-products', label: 'Products', icon: '🛍️' },
  { id: 'local-demand', label: 'Local', icon: '📍' },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<OpportunityCategory | 'all'>('all');
  const [savedIds, setSavedIds] = useState<string[]>(['1', '3']);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  const headerAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerAnim, searchAnim, statsAnim]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const stats = useMemo(() => ({
    trending: opportunities.filter(o => o.trending).length,
    beginner: opportunities.filter(o => o.difficulty === 'beginner').length,
    avgScore: Math.round(opportunities.reduce((acc, o) => acc + o.trendingScore, 0) / opportunities.length),
  }), []);

  const handleToggleSave = useCallback((id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
    );
  }, []);

  const handleOpportunityPress = useCallback((id: string) => {
    router.push(`/opportunity/${id}`);
  }, [router]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const renderOpportunityCard = useCallback(
    ({ item, index }: { item: Opportunity; index: number }) => (
      <OpportunityCard
        opportunity={item}
        isSaved={savedIds.includes(item.id)}
        onPress={() => handleOpportunityPress(item.id)}
        onToggleSave={() => handleToggleSave(item.id)}
        index={index}
      />
    ),
    [savedIds, handleOpportunityPress, handleToggleSave]
  );

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => {
    const isActive = selectedCategory === item.id;
    
    return (
      <Pressable
        style={[
          styles.categoryButton,
        ]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <Animated.View
          style={[
            styles.categoryContent,
            isActive && styles.categoryContentActive,
          ]}
        >
          <Text style={styles.categoryIcon}>{item.icon}</Text>
          <Text
            style={[
              styles.categoryLabel,
              isActive && styles.categoryLabelActive,
            ]}
          >
            {item.label}
          </Text>
        </Animated.View>
      </Pressable>
    );
  };

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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Discover</Text>
              <View style={styles.titleBadge}>
                <Sparkles size={14} color={colors.accent.quaternary} />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <View style={styles.notificationBadge} />
            <Zap size={22} color={colors.accent.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Animated.View
          style={[
            styles.searchContainer,
            searchFocused && styles.searchContainerFocused,
            {
              opacity: searchAnim,
              transform: [
                {
                  translateY: searchAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Search 
            size={20} 
            color={searchFocused ? colors.accent.primary : colors.text.tertiary} 
            strokeWidth={2}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search opportunities..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <SlidersHorizontal size={20} color={colors.text.tertiary} strokeWidth={2} />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Categories */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Stats Row */}
      <Animated.View
        style={[
          styles.statsContainer,
          {
            opacity: statsAnim,
            transform: [
              {
                translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: colors.status.successBg }]}>
            <TrendingUp size={18} color={colors.status.success} strokeWidth={2.5} />
          </View>
          <Text style={styles.statNumber}>{stats.trending}</Text>
          <Text style={styles.statLabel}>Trending</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: colors.status.infoBg }]}>
            <Clock size={18} color={colors.status.info} strokeWidth={2.5} />
          </View>
          <Text style={styles.statNumber}>{stats.beginner}</Text>
          <Text style={styles.statLabel}>Beginner</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: colors.status.warningBg }]}>
            <Zap size={18} color={colors.status.warning} strokeWidth={2.5} />
          </View>
          <Text style={styles.statNumber}>{stats.avgScore}</Text>
          <Text style={styles.statLabel}>Avg Score</Text>
        </View>
      </Animated.View>

      {/* Opportunities List */}
      <FlatList
        data={filteredOpportunities}
        renderItem={renderOpportunityCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.opportunitiesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent.primary}
            colors={[colors.accent.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Search size={32} color={colors.text.tertiary} strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>No opportunities found</Text>
            <Text style={styles.emptyDescription}>
              Try adjusting your filters or search query
            </Text>
          </View>
        }
      />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greeting: {
    color: colors.text.tertiary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
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
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.tertiary,
    borderWidth: 1.5,
    borderColor: colors.background.card,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  searchContainerFocused: {
    borderColor: colors.accent.primary,
    ...shadows.glow,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
    fontWeight: '500',
  },
  filterButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  categoriesWrapper: {
    marginBottom: spacing.lg,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: spacing.xs,
  },
  categoryContentActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryLabel: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: colors.background.primary,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statNumber: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  opportunitiesList: {
    paddingTop: spacing.sm,
    paddingBottom: 120,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  emptyTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    color: colors.text.tertiary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
