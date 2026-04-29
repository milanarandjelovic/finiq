export const routes = {
  // Root
  index: '/',

  // Auth
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',

  // Dashboard
  dashboard: '/dashboard',
  transactions: '/dashboard/transactions',
  budget: '/dashboard/budget',
  categories: '/dashboard/categories',
  goals: '/dashboard/goals',
  stats: '/dashboard/stats',
  profile: '/dashboard/profile',
  settings: '/dashboard/settings',
} as const

export const routeNames: Record<keyof typeof routes, string> = {
  index: 'Index',
  login: 'Login',
  register: 'Register',
  forgotPassword: 'Forgot Password',
  resetPassword: 'Reset Password',
  verifyEmail: 'Verify Email',
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  budget: 'Budget',
  categories: 'Categories',
  goals: 'Goals',
  stats: 'Statistics',
  profile: 'Profile',
  settings: 'Settings',
} as const
