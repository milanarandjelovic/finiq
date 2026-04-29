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
  { href: routes.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { href: routes.transactions, label: 'Transactions', icon: Wallet },
  { href: routes.budget, label: 'Budget', icon: PiggyBank },
  { href: routes.categories, label: 'Categories', icon: Tag },
  { href: routes.goals, label: 'Goals', icon: Target },
  { href: routes.stats, label: 'Statistics', icon: BarChart3 },
]

export const bottomNavItems = [
  { href: routes.settings, label: 'Settings', icon: Settings },
  { href: routes.profile, label: 'Profile', icon: User },
]
