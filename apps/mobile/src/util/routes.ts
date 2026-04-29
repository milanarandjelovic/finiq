export const routes = {
  // Root
  index: '/',
  notFound: '/+not-found',

  // Auth
  login: '/(auth)/login',
  register: '/(auth)/register',
  forgotPassword: '/(auth)/forgot-password',
  resetPassword: '/(auth)/reset-password',

  // Tabs
  dashboard: '/(tabs)',
  transactions: '/(tabs)/transactions',
  budget: '/(tabs)/budget',
  categories: '/(tabs)/categories',
  goals: '/(tabs)/goals',
  stats: '/(tabs)/stats',
  settings: '/(tabs)/settings',
} as const

export const routeNames: Record<keyof typeof routes, string> = {
  index: 'Index',
  notFound: 'Not Found',
  login: 'Login Screen',
  register: 'Register Screen',
  forgotPassword: 'Forgot Password Screen',
  resetPassword: 'Reset Password Screen',
  dashboard: 'Dashboard Screen',
  transactions: 'Transactions Screen',
  budget: 'Budget Screen',
  categories: 'Categories Screen',
  goals: 'Goals Screen',
  stats: 'Statistics Screen',
  settings: 'Settings Screen',
} as const
