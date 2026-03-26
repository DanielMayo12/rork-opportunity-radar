export const colors = {
  background: {
    primary: '#050505',
    secondary: '#0A0A0C',
    tertiary: '#111114',
    card: '#16161A',
    elevated: '#1E1E24',
    glass: 'rgba(22, 22, 26, 0.85)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    tertiary: '#6B7280',
    muted: '#4B5563',
    inverse: '#050505',
  },
  accent: {
    primary: '#10B981',
    primaryGlow: 'rgba(16, 185, 129, 0.3)',
    secondary: '#06B6D4',
    secondaryGlow: 'rgba(6, 182, 212, 0.3)',
    tertiary: '#F59E0B',
    tertiaryGlow: 'rgba(245, 158, 11, 0.3)',
    quaternary: '#8B5CF6',
    quaternaryGlow: 'rgba(139, 92, 246, 0.3)',
  },
  gradient: {
    emerald: ['#059669', '#10B981', '#34D399'] as const,
    cyan: ['#0891B2', '#06B6D4', '#22D3EE'] as const,
    amber: ['#D97706', '#F59E0B', '#FBBF24'] as const,
    violet: ['#7C3AED', '#8B5CF6', '#A78BFA'] as const,
    dark: ['#111114', '#16161A', '#1E1E24'] as const,
  },
  border: {
    default: '#27272A',
    active: '#3F3F46',
    subtle: 'rgba(39, 39, 42, 0.5)',
    glow: 'rgba(16, 185, 129, 0.2)',
  },
  status: {
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.15)',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.15)',
    info: '#06B6D4',
    infoBg: 'rgba(6, 182, 212, 0.15)',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

export const typography = {
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  weight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: {
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const animations = {
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  easing: {
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: { friction: 8, tension: 40 },
  },
} as const;

export default colors;
