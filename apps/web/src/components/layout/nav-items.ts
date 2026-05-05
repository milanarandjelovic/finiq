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

import { routes } from '@/lib/routes'

export const navItems = [
  {
    href: routes.dashboard,
    labelKey: 'sidebar.dashboard',
    icon: LayoutDashboard,
  },
  { href: routes.transactions, labelKey: 'sidebar.transactions', icon: Wallet },
  { href: routes.budget, labelKey: 'sidebar.budget', icon: PiggyBank },
  { href: routes.categories, labelKey: 'sidebar.categories', icon: Tag },
  { href: routes.goals, labelKey: 'sidebar.goals', icon: Target },
  { href: routes.stats, labelKey: 'sidebar.statistics', icon: BarChart3 },
]

export const bottomNavItems = [
  { href: routes.settings, labelKey: 'sidebar.settings', icon: Settings },
  { href: routes.profile, labelKey: 'sidebar.profile', icon: User },
]
