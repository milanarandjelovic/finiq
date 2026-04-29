/**
 * Design tokens derived from tooling/tailwind-config/style.css (Vercel theme).
 * oklch values are converted to hex for React Native compatibility.
 */

export const lightColors = {
  // Backgrounds
  background: '#fafafa',
  card: '#ffffff',
  popover: '#fafafa',

  // Foregrounds
  foreground: '#000000',
  cardForeground: '#000000',
  popoverForeground: '#000000',

  // Primary (black/white in Vercel theme)
  primary: '#000000',
  primaryForeground: '#ffffff',

  // Secondary
  secondary: '#ebebeb',
  secondaryForeground: '#000000',

  // Muted
  muted: '#f5f5f5',
  mutedForeground: '#525252',

  // Accent
  accent: '#ebebeb',
  accentForeground: '#000000',

  // Semantic states
  destructive: '#e5484d',
  destructiveForeground: '#ffffff',
  success: '#30a46c',
  successForeground: '#ffffff',

  // Border / Input / Ring
  border: '#e4e4e4',
  input: '#ebebeb',
  ring: '#000000',

  // Chart palette
  chart1: '#d4a017',
  chart2: '#5b5bd6',
  chart3: '#a8a8a8',
  chart4: '#e4e4e4',
  chart5: '#737373',
} as const

export const darkColors = {
  background: '#000000',
  card: '#0a0a0a',
  popover: '#111111',

  foreground: '#ffffff',
  cardForeground: '#ffffff',
  popoverForeground: '#ffffff',

  primary: '#ffffff',
  primaryForeground: '#000000',

  secondary: '#222222',
  secondaryForeground: '#ffffff',

  muted: '#1c1c1c',
  mutedForeground: '#a4a4a4',

  accent: '#333333',
  accentForeground: '#ffffff',

  destructive: '#f2555a',
  destructiveForeground: '#000000',
  success: '#3dd68c',
  successForeground: '#000000',

  border: '#262626',
  input: '#333333',
  ring: '#a4a4a4',

  chart1: '#d4a017',
  chart2: '#6969e8',
  chart3: '#737373',
  chart4: '#4a4a4a',
  chart5: '#e4e4e4',
} as const

export const spacing = {
  0: 0,
  1: 4, // 0.25rem
  2: 8, // 0.5rem
  3: 12, // 0.75rem
  4: 16, // 1rem
  5: 20, // 1.25rem
  6: 24, // 1.5rem
  8: 32, // 2rem
  10: 40, // 2.5rem
  12: 48, // 3rem
  16: 64, // 4rem
  20: 80, // 5rem
} as const

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
} as const

export const theme = {
  light: lightColors,
  dark: darkColors,
  spacing,
  radius,
} as const

export type ColorScheme = 'light' | 'dark'
export type ThemeColors = typeof lightColors
export type ThemeColorKey = keyof ThemeColors
