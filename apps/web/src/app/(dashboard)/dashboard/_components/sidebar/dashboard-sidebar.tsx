'use client'

import Link from 'next/link'
import {
  BarChart3Icon,
  HomeIcon,
  LayoutGridIcon,
  PiggyBankIcon,
  SettingsIcon,
  TagIcon,
  TargetIcon,
  WalletIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@finiq/ui/components/sidebar'
import { DashboardLinks } from '@/app/(dashboard)/dashboard/_components/sidebar/dashboard-links'
import { SidebarUserMenu } from '@/app/(dashboard)/dashboard/_components/sidebar/sidebar-user-menu'
import { ROUTES } from '@/util/routes'

export function DashboardSidebar() {
  const { t } = useTranslation()

  const menuLinks = [
    {
      name: t('sidebar.dashboard'),
      url: ROUTES.DASHBOARD,
      icon: <HomeIcon className="size-4" />,
    },
    {
      name: t('sidebar.budget'),
      url: ROUTES.BUDGET,
      icon: <PiggyBankIcon className="size-4" />,
    },
    {
      name: t('sidebar.transactions'),
      url: ROUTES.TRANSACTIONS,
      icon: <WalletIcon className="size-4" />,
    },
    {
      name: t('sidebar.stats'),
      url: ROUTES.STATS,
      icon: <BarChart3Icon className="size-4" />,
    },
    {
      name: t('sidebar.goals'),
      url: ROUTES.GOALS,
      icon: <TargetIcon className="size-4" />,
    },
  ]

  const otherLinks = [
    {
      name: t('sidebar.categories'),
      url: ROUTES.CATEGORIES,
      icon: <TagIcon className="size-4" />,
    },
    {
      name: t('sidebar.settings'),
      url: ROUTES.SETTINGS,
      icon: <SettingsIcon className="size-4" />,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href={ROUTES.DASHBOARD}
          className="my-2 flex flex-row items-center gap-2.5"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold tracking-tight">
            <LayoutGridIcon className="size-4" />
          </div>
          <span className="font-semibold tracking-tight [[data-side=left][data-state=collapsed]_&]:hidden [[data-side=right][data-state=collapsed]_&]:hidden">
            Finiq
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <DashboardLinks groupLabel={t('sidebar.general')} items={menuLinks} />
        <DashboardLinks groupLabel={t('sidebar.other')} items={otherLinks} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
