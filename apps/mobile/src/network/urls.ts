export const urls = {
  api: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      logout: '/auth/logout',
    },
    dashboard: {
      get: '/dashboard',
    },
    transactions: {
      findAll: '/transactions',
      create: '/transactions',
      delete: (id: string) => `/transactions/${id}`,
    },
    categories: {
      findAll: '/categories',
      create: '/categories',
      update: (id: string) => `/categories/${id}`,
      delete: (id: string) => `/categories/${id}`,
    },
    budgets: {
      findAll: '/budgets',
      upsert: '/budgets',
      copy: '/budgets/copy',
    },
    statistics: {
      get: '/statistics',
    },
    settings: {
      findAll: '/settings',
      update: '/settings',
    },
    profile: {
      update: '/user/profile',
    },
    password: {
      change: '/user/password',
    },
  },
}
