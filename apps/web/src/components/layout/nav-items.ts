import {
  BarChart3,
  LayoutDashboard,
  PiggyBank,
  Settings,
  Tag,
  Target,
  User,
  Wallet,
} from 'lucide-react'

import { ROUTES } from '@/util/routes'

export const navItems = [
  {
    href: ROUTES.DASHBOARD,
    labelKey: 'sidebar.dashboard',
    icon: LayoutDashboard,
  },
  { href: ROUTES.TRANSACTIONS, labelKey: 'sidebar.transactions', icon: Wallet },
  { href: ROUTES.BUDGET, labelKey: 'sidebar.budget', icon: PiggyBank },
  { href: ROUTES.CATEGORIES, labelKey: 'sidebar.categories', icon: Tag },
  { href: ROUTES.GOALS, labelKey: 'sidebar.goals', icon: Target },
  { href: ROUTES.STATS, labelKey: 'sidebar.statistics', icon: BarChart3 },
]

export const bottomNavItems = [
  { href: ROUTES.SETTINGS, labelKey: 'sidebar.settings', icon: Settings },
  { href: ROUTES.PROFILE, labelKey: 'sidebar.profile', icon: User },
]
