export const ROUTES = {
  // Root
  INDEX: '/',

  // Not Found
  NOT_FOUND: '/+not-found',

  // Auth
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',
  FORGOT_PASSWORD: '/(auth)/forgot-password',
  RESET_PASSWORD: '/(auth)/reset-password',

  // Dashboard
  DASHBOARD: '/(tabs)',

  // Transactions
  TRANSACTIONS: '/(tabs)/transactions',

  // Budget
  BUDGET: '/(tabs)/budget',

  // Categories
  CATEGORIES: '/(tabs)/categories',

  // Goals
  GOALS: '/(tabs)/goals',

  // Statistics
  STATS: '/(tabs)/stats',

  // Settings
  SETTINGS: '/(tabs)/settings',
} as const

export const ROUTE_NAMES: Record<keyof typeof ROUTES, string> = {
  INDEX: 'Index',
  NOT_FOUND: 'Not Found',
  LOGIN: 'Login Screen',
  REGISTER: 'Register Screen',
  FORGOT_PASSWORD: 'Forgot Password Screen',
  RESET_PASSWORD: 'Reset Password Screen',
  DASHBOARD: 'Dashboard Screen',
  TRANSACTIONS: 'Transactions Screen',
  BUDGET: 'Budget Screen',
  CATEGORIES: 'Categories Screen',
  GOALS: 'Goals Screen',
  STATS: 'Statistics Screen',
  SETTINGS: 'Settings Screen',
} as const
