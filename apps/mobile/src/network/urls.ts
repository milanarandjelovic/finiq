export const URLS = {
  API: {
    // Auth
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      LOGOUT: '/auth/logout',
    },

    // Dashboard
    DASHBOARD: {
      GET: '/dashboard',
    },

    // Transactions
    TRANSACTIONS: {
      FIND_ALL: '/transactions',
      CREATE: '/transactions',
      DELETE: (id: string) => `/transactions/${id}`,
    },

    // Categories
    CATEGORIES: {
      FIND_ALL: '/categories',
      CREATE: '/categories',
      UPDATE: (id: string) => `/categories/${id}`,
      DELETE: (id: string) => `/categories/${id}`,
    },

    // Budgets
    BUDGETS: {
      FIND_ALL: '/budgets',
      UPSERT: '/budgets',
      COPY: '/budgets/copy',
    },

    // Statistics
    STATISTICS: {
      GET: '/statistics',
    },

    // Settings
    SETTINGS: {
      FIND_ALL: '/settings',
      UPDATE: '/settings',
    },

    // Profile
    PROFILE: {
      UPDATE: '/user/profile',
    },

    // Password
    PASSWORD: {
      CHANGE: '/user/password',
    },
  },
}
