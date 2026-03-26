import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Radar, 
  Zap, 
  TrendingUp, 
  Shield, 
  Check,
  Briefcase,
  RefreshCw,
  Users,
  Globe,
  MapPin,
  Cpu,
  ShoppingBag,
  Sparkles,
  Bell,
  ArrowRight,
} from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows } from '@/constants/colors';
import { UserInterest } from '@/types/opportunity';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

type OnboardingStep = 'welcome' | 'interests' | 'region' | 'personalization';

const interests: { id: UserInterest; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    id: 'side-hustles', 
    label: 'Side Hustles', 
    icon: <Briefcase size={22} color={colors.accent.primary} strokeWidth={2} />,
    description: 'Extra income alongside your main job'
  },
  { 
    id: 'reselling', 
    label: 'Reselling', 
    icon: <RefreshCw size={22} color={colors.accent.secondary} strokeWidth={2} />,
    description: 'Buy low, sell high for profit'
  },
  { 
    id: 'freelancing', 
    label: 'Freelancing', 
    icon: <Users size={22} color={colors.accent.tertiary} strokeWidth={2} />,
    description: 'Sell your skills to clients worldwide'
  },
  { 
    id: 'investing', 
    label: 'Investing', 
    icon: <TrendingUp size={22} color={colors.accent.quaternary} strokeWidth={2} />,
    description: 'Grow your money over time'
  },
  { 
    id: 'online-business', 
    label: 'Online Business', 
    icon: <Globe size={22} color={colors.accent.primary} strokeWidth={2} />,
    description: 'Build digital products and services'
  },
  { 
    id: 'local-opportunities', 
    label: 'Local Opportunities', 
    icon: <MapPin size={22} color={colors.accent.secondary} strokeWidth={2} />,
    description: 'Services and businesses in your area'
  },
  { 
    id: 'ai-opportunities', 
    label: 'AI Opportunities', 
    icon: <Cpu size={22} color={colors.accent.tertiary} strokeWidth={2} />,
    description: 'Leverage AI tools for income'
  },
  { 
    id: 'trending-products', 
    label: 'Trending Products', 
    icon: <ShoppingBag size={22} color={colors.accent.quaternary} strokeWidth={2} />,
    description: 'Ride the wave of viral products'
  },
];

const regions = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'India',
  'Singapore',
  'Other',
];

const welcomeSlides = [
  {
    icon: Radar,
    title: 'Discover Hidden Opportunities',
    description: 'Get real-time alerts on money-making trends before they go mainstream. Be the first to know.',
    color: colors.accent.primary,
    bgColor: colors.status.successBg,
  },
  {
    icon: TrendingUp,
    title: 'Data-Backed Insights',
    description: 'Every opportunity comes with market research, competition analysis, and earning potential.',
    color: colors.accent.secondary,
    bgColor: colors.status.infoBg,
  },
  {
    icon: Zap,
    title: 'Actionable Steps',
    description: 'Not just ideas—get step-by-step guides to actually start earning. From zero to income.',
    color: colors.accent.quaternary,
    bgColor: `${colors.accent.quaternary}20`,
  },
  {
    icon: Shield,
    title: 'Curated & Verified',
    description: 'We filter out the noise. Only real opportunities with actual earning potential make the cut.',
    color: colors.accent.tertiary,
    bgColor: colors.status.warningBg,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<UserInterest[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, currentSlide]);

  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentStep === 'welcome') {
      if (currentSlide < welcomeSlides.length - 1) {
        animateTransition(() => setCurrentSlide(currentSlide + 1));
      } else {
        animateTransition(() => setCurrentStep('interests'));
      }
    } else if (currentStep === 'interests') {
      animateTransition(() => setCurrentStep('region'));
    } else if (currentStep === 'region') {
      animateTransition(() => setCurrentStep('personalization'));
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    void AsyncStorage.setItem('onboardingCompleted', 'true');
    void AsyncStorage.setItem('userInterests', JSON.stringify(selectedInterests));
    void AsyncStorage.setItem('userRegion', selectedRegion);
    router.replace('/(tabs)');
  };

  const toggleInterest = (id: UserInterest) => {
    setSelectedInterests(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const CurrentWelcomeIcon = welcomeSlides[currentSlide].icon;
  const currentWelcomeSlide = welcomeSlides[currentSlide];

  const canProceed = () => {
    switch (currentStep) {
      case 'welcome':
        return true;
      case 'interests':
        return selectedInterests.length > 0;
      case 'region':
        return selectedRegion !== '';
      case 'personalization':
        return true;
      default:
        return false;
    }
  };

  const renderWelcomeStep = () => (
    <>
      <Animated.View style={[styles.backgroundGlow, { opacity: fadeAnim }]}>
        <View style={[styles.glow, { backgroundColor: currentWelcomeSlide.color, opacity: 0.12 }]} />
      </Animated.View>

      <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding} activeOpacity={0.7}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={[styles.iconContainer, { borderColor: currentWelcomeSlide.color }]}>
          <View style={[styles.iconGlow, { backgroundColor: currentWelcomeSlide.color }]} />
          <CurrentWelcomeIcon size={44} color={currentWelcomeSlide.color} strokeWidth={1.5} />
        </View>

        <Text style={styles.welcomeTitle}>{currentWelcomeSlide.title}</Text>
        <Text style={styles.welcomeDescription}>{currentWelcomeSlide.description}</Text>
      </Animated.View>

      <View style={styles.progressContainer}>
        {welcomeSlides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentSlide(index)}
            style={styles.progressButton}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index === currentSlide
                      ? currentWelcomeSlide.color
                      : colors.text.muted,
                  width: index === currentSlide ? 24 : 8,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderInterestsStep = () => (
    <>
      <Animated.View style={[styles.backgroundGlow, { opacity: fadeAnim }]}>
        <View style={[styles.glow, { backgroundColor: colors.accent.primary, opacity: 0.08 }]} />
      </Animated.View>

      <Animated.View
        style={[
          styles.interestsContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.stepHeader}>
          <View style={[styles.stepBadge, { backgroundColor: colors.status.successBg }]}>
            <Text style={[styles.stepBadgeText, { color: colors.accent.primary }]}>Step 1 of 3</Text>
          </View>
          <Text style={styles.stepTitle}>What interests you?</Text>
          <Text style={styles.stepDescription}>
            Select at least one area. We will personalize your feed based on your choices.
          </Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.interestsGrid}
        >
          {interests.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <Pressable
                key={interest.id}
                style={[
                  styles.interestCard,
                  isSelected && styles.interestCardSelected,
                ]}
                onPress={() => toggleInterest(interest.id)}
              >
                <View style={styles.interestCardContent}>
                  <View style={[
                    styles.interestIconContainer,
                    isSelected && { backgroundColor: colors.status.successBg }
                  ]}>
                    {interest.icon}
                  </View>
                  <View style={styles.interestTextContainer}>
                    <Text style={[
                      styles.interestLabel,
                      isSelected && styles.interestLabelSelected,
                    ]}>
                      {interest.label}
                    </Text>
                    <Text style={styles.interestDescription}>
                      {interest.description}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.checkCircle,
                  isSelected && styles.checkCircleSelected,
                ]}>
                  {isSelected && <Check size={14} color={colors.background.primary} strokeWidth={3} />}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.selectedCount}>
          <Text style={styles.selectedCountText}>
            {selectedInterests.length} selected
          </Text>
        </View>
      </Animated.View>
    </>
  );

  const renderRegionStep = () => (
    <>
      <Animated.View style={[styles.backgroundGlow, { opacity: fadeAnim }]}>
        <View style={[styles.glow, { backgroundColor: colors.accent.secondary, opacity: 0.08 }]} />
      </Animated.View>

      <Animated.View
        style={[
          styles.regionContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.stepHeader}>
          <View style={[styles.stepBadge, { backgroundColor: colors.status.infoBg }]}>
            <Text style={[styles.stepBadgeText, { color: colors.accent.secondary }]}>Step 2 of 3</Text>
          </View>
          <Text style={styles.stepTitle}>Where are you located?</Text>
          <Text style={styles.stepDescription}>
            We will show opportunities relevant to your region and local market conditions.
          </Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.regionList}
        >
          {regions.map((region) => {
            const isSelected = selectedRegion === region;
            return (
              <Pressable
                key={region}
                style={[
                  styles.regionCard,
                  isSelected && styles.regionCardSelected,
                ]}
                onPress={() => setSelectedRegion(region)}
              >
                <Text style={[
                  styles.regionLabel,
                  isSelected && styles.regionLabelSelected,
                ]}>
                  {region}
                </Text>
                {isSelected && <Check size={18} color={colors.accent.secondary} strokeWidth={2.5} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>
    </>
  );

  const renderPersonalizationStep = () => (
    <>
      <Animated.View style={[styles.backgroundGlow, { opacity: fadeAnim }]}>
        <View style={[styles.glow, { backgroundColor: colors.accent.quaternary, opacity: 0.08 }]} />
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={[styles.iconContainer, { borderColor: colors.accent.quaternary }]}>
          <View style={[styles.iconGlow, { backgroundColor: colors.accent.quaternary }]} />
          <Sparkles size={44} color={colors.accent.quaternary} strokeWidth={1.5} />
        </View>

        <Text style={styles.welcomeTitle}>You are All Set!</Text>
        <Text style={styles.welcomeDescription}>
          Based on your interests and location, we will curate the best opportunities for you. 
          Get ready to discover your next income stream.
        </Text>

        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.status.successBg }]}>
              <Radar size={20} color={colors.accent.primary} strokeWidth={2} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Personalized Feed</Text>
              <Text style={styles.featureDescription}>Opportunities matched to your interests</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.status.infoBg }]}>
              <Bell size={20} color={colors.accent.secondary} strokeWidth={2} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Smart Alerts</Text>
              <Text style={styles.featureDescription}>Be first to know about trending opportunities</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.status.warningBg }]}>
              <Zap size={20} color={colors.accent.tertiary} strokeWidth={2} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Action Plans</Text>
              <Text style={styles.featureDescription}>Step-by-step guides to get started</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </>
  );

  const getButtonColor = () => {
    if (!canProceed()) return colors.text.muted;
    if (currentStep === 'welcome') return currentWelcomeSlide.color;
    return colors.accent.primary;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {currentStep === 'welcome' && renderWelcomeStep()}
      {currentStep === 'interests' && renderInterestsStep()}
      {currentStep === 'region' && renderRegionStep()}
      {currentStep === 'personalization' && renderPersonalizationStep()}

      {/* Navigation Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: getButtonColor() },
            !canProceed() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 'personalization' ? 'Start Exploring' : 'Continue'}
          </Text>
          <ArrowRight size={20} color={colors.background.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    top: height * 0.05,
    left: width / 2 - 250,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.xl,
    padding: spacing.sm,
  },
  skipText: {
    color: colors.text.secondary,
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 100,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    opacity: 0.12,
  },
  welcomeTitle: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  welcomeDescription: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 40,
  },
  progressButton: {
    padding: spacing.xs,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  interestsContent: {
    flex: 1,
    width: '100%',
    paddingTop: 60,
  },
  stepHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  stepTitle: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  stepDescription: {
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
  },
  interestsGrid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 20,
    gap: spacing.md,
  },
  interestCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  interestCardSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: `${colors.accent.primary}08`,
  },
  interestCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  interestIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  interestTextContainer: {
    flex: 1,
  },
  interestLabel: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  interestLabelSelected: {
    color: colors.accent.primary,
  },
  interestDescription: {
    color: colors.text.tertiary,
    fontSize: 13,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  checkCircleSelected: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  selectedCount: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  selectedCountText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  regionContent: {
    flex: 1,
    width: '100%',
    paddingTop: 60,
  },
  regionList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 20,
    gap: spacing.sm,
  },
  regionCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  regionCardSelected: {
    borderColor: colors.accent.secondary,
    backgroundColor: `${colors.accent.secondary}08`,
  },
  regionLabel: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  regionLabelSelected: {
    color: colors.accent.secondary,
  },
  featuresList: {
    marginTop: spacing.xl,
    gap: spacing.md,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDescription: {
    color: colors.text.tertiary,
    fontSize: 13,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
    width: '100%',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: colors.background.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
