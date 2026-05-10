export const ROUTES = {
  // Root
  INDEX: '/',

  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Transactions
  TRANSACTIONS: '/dashboard/transactions',

  // Budget
  BUDGET: '/dashboard/budget',

  // Categories
  CATEGORIES: '/dashboard/categories',

  // Goals
  GOALS: '/dashboard/goals',

  // Statistics
  STATS: '/dashboard/stats',

  // Profile
  PROFILE: '/dashboard/profile',

  // Settings
  SETTINGS: '/dashboard/settings',
} as const

export const PATH_TO_ROUTE_KEY = Object.fromEntries(
  (Object.keys(ROUTES) as (keyof typeof ROUTES)[]).map((key) => [
    ROUTES[key],
    key.toLowerCase().replace(/_/g, '-'),
  ]),
) as Record<string, string>
