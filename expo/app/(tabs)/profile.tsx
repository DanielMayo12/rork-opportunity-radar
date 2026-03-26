import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Bell,
  Moon,
  Shield,
  HelpCircle,
  FileText,
  Star,
  ChevronRight,
  LogOut,
  Zap,
  Crown,
  Globe,
  Briefcase,
  RefreshCw,
  Users,
  TrendingUp,
  Cpu,
  ShoppingBag,
  MapPin,
  ChevronDown,
  Sparkles,
} from 'lucide-react-native';
import { colors, spacing, borderRadius } from '@/constants/colors';
import { userProfile } from '@/constants/mockData';
import { UserInterest } from '@/types/opportunity';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightElement,
}) => (
  <TouchableOpacity
    style={styles.settingsItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingsIcon}>{icon}</View>
    <View style={styles.settingsContent}>
      <Text style={styles.settingsTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
    </View>
    {rightElement || (showArrow && <ChevronRight size={20} color={colors.text.tertiary} strokeWidth={2} />)}
  </TouchableOpacity>
);

const getInterestIcon = (interest: UserInterest) => {
  switch (interest) {
    case 'side-hustles': return <Briefcase size={16} color={colors.accent.primary} strokeWidth={2} />;
    case 'reselling': return <RefreshCw size={16} color={colors.accent.secondary} strokeWidth={2} />;
    case 'freelancing': return <Users size={16} color={colors.accent.tertiary} strokeWidth={2} />;
    case 'investing': return <TrendingUp size={16} color={colors.accent.quaternary} strokeWidth={2} />;
    case 'online-business': return <Globe size={16} color={colors.accent.primary} strokeWidth={2} />;
    case 'local-opportunities': return <MapPin size={16} color={colors.accent.secondary} strokeWidth={2} />;
    case 'ai-opportunities': return <Cpu size={16} color={colors.accent.tertiary} strokeWidth={2} />;
    case 'trending-products': return <ShoppingBag size={16} color={colors.accent.quaternary} strokeWidth={2} />;
    default: return <Star size={16} color={colors.accent.primary} strokeWidth={2} />;
  }
};

const getInterestLabel = (interest: UserInterest) => {
  return interest.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(userProfile.notificationsEnabled);
  const [darkModeEnabled, setDarkModeEnabled] = useState(userProfile.darkModeEnabled);
  const [showAllInterests, setShowAllInterests] = useState(false);
  
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const displayedInterests = showAllInterests 
    ? userProfile.interests 
    : userProfile.interests.slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
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
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={40} color={colors.accent.primary} strokeWidth={1.5} />
            </View>
            <View style={styles.avatarBadge}>
              <Crown size={14} color={colors.accent.quaternary} strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.name}>{userProfile.name}</Text>
          <Text style={styles.email}>{userProfile.email}</Text>
          <View style={styles.memberBadge}>
            <Sparkles size={12} color={colors.accent.quaternary} strokeWidth={2} />
            <Text style={styles.memberText}>Pro Member</Text>
          </View>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: contentAnim,
              transform: [
                {
                  translateY: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.savedOpportunities.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Viewed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Started</Text>
          </View>
        </Animated.View>

        {/* Premium Upgrade Banner */}
        <Animated.View 
          style={[
            styles.premiumBanner,
            {
              opacity: contentAnim,
            },
          ]}
        >
          <View style={styles.premiumContent}>
            <View style={styles.premiumIconContainer}>
              <Crown size={28} color={colors.accent.quaternary} strokeWidth={2} />
            </View>
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>Upgrade to Pro</Text>
              <Text style={styles.premiumDescription}>
                Unlock exclusive opportunities and advanced analytics
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.premiumButton} activeOpacity={0.8}>
            <Text style={styles.premiumButtonText}>Upgrade</Text>
          </TouchableOpacity>
          <View style={styles.premiumFeatures}>
            <View style={styles.premiumFeature}>
              <Zap size={14} color={colors.accent.quaternary} strokeWidth={2} />
              <Text style={styles.premiumFeatureText}>Early access to trends</Text>
            </View>
            <View style={styles.premiumFeature}>
              <Bell size={14} color={colors.accent.quaternary} strokeWidth={2} />
              <Text style={styles.premiumFeatureText}>Priority alerts</Text>
            </View>
          </View>
        </Animated.View>

        {/* Interests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Interests</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.sectionAction}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.interestsContainer}>
            {displayedInterests.map((interest) => (
              <View key={interest} style={styles.interestTag}>
                {getInterestIcon(interest)}
                <Text style={styles.interestTagText}>
                  {getInterestLabel(interest)}
                </Text>
              </View>
            ))}
          </View>
          {userProfile.interests.length > 3 && (
            <TouchableOpacity 
              style={styles.showMoreButton}
              onPress={() => setShowAllInterests(!showAllInterests)}
              activeOpacity={0.7}
            >
              <Text style={styles.showMoreText}>
                {showAllInterests ? 'Show Less' : `+${userProfile.interests.length - 3} more`}
              </Text>
              <ChevronDown 
                size={16} 
                color={colors.text.tertiary} 
                strokeWidth={2}
                style={{ transform: [{ rotate: showAllInterests ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Region Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Region</Text>
          <View style={styles.regionCard}>
            <View style={styles.regionIconContainer}>
              <Globe size={20} color={colors.accent.secondary} strokeWidth={2} />
            </View>
            <View style={styles.regionContent}>
              <Text style={styles.regionLabel}>Location</Text>
              <Text style={styles.regionValue}>{userProfile.region}</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} strokeWidth={2} />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<Bell size={20} color={colors.accent.primary} strokeWidth={2} />}
              title="Notifications"
              subtitle="Get alerts for new opportunities"
              showArrow={false}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.text.muted, true: colors.accent.primary }}
                  thumbColor={colors.background.primary}
                />
              }
            />
            <SettingsItem
              icon={<Moon size={20} color={colors.accent.secondary} strokeWidth={2} />}
              title="Dark Mode"
              subtitle="Easier on the eyes"
              showArrow={false}
              rightElement={
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: colors.text.muted, true: colors.accent.secondary }}
                  thumbColor={colors.background.primary}
                />
              }
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<Star size={20} color={colors.accent.quaternary} strokeWidth={2} />}
              title="Manage Interests"
              subtitle="Customize your feed"
            />
            <SettingsItem
              icon={<Shield size={20} color={colors.accent.primary} strokeWidth={2} />}
              title="Privacy & Security"
              subtitle="Password, 2FA, and more"
            />
            <SettingsItem
              icon={<Globe size={20} color={colors.accent.secondary} strokeWidth={2} />}
              title="Region Settings"
              subtitle="Change your location"
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<HelpCircle size={20} color={colors.accent.tertiary} strokeWidth={2} />}
              title="Help Center"
              subtitle="FAQs and tutorials"
            />
            <SettingsItem
              icon={<FileText size={20} color={colors.text.secondary} strokeWidth={2} />}
              title="Terms of Service"
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <LogOut size={20} color={colors.accent.tertiary} strokeWidth={2} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Opportunity Radar v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.border.active,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background.primary,
  },
  name: {
    color: colors.text.primary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  email: {
    color: colors.text.secondary,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: `${colors.accent.quaternary}20`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  memberText: {
    color: colors.accent.quaternary,
    fontSize: 13,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.text.tertiary,
    fontSize: 13,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.default,
  },
  premiumBanner: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.accent.quaternary}40`,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  premiumIconContainer: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: `${colors.accent.quaternary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  premiumDescription: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 18,
  },
  premiumButton: {
    backgroundColor: colors.accent.quaternary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  premiumButtonText: {
    color: colors.background.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  premiumFeatures: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  premiumFeatureText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionAction: {
    color: colors.accent.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  interestTagText: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  showMoreText: {
    color: colors.text.tertiary,
    fontSize: 13,
    fontWeight: '500',
  },
  regionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  regionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.accent.secondary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  regionContent: {
    flex: 1,
  },
  regionLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginBottom: 2,
  },
  regionValue: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionContent: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  settingsSubtitle: {
    color: colors.text.tertiary,
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  logoutText: {
    color: colors.accent.tertiary,
    fontSize: 15,
    fontWeight: '600',
  },
  version: {
    color: colors.text.muted,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
