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

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@finiq/ui/components/sidebar'
import { DashboardLinks } from '@/app/(dashboard)/dashboard/_components/sidebar/dashboard-links'
import { SidebarUserMenu } from '@/app/(dashboard)/dashboard/_components/sidebar/sidebar-user-menu'
import { routes } from '@/lib/routes'

export function DashboardSidebar() {
  const menuLinks = [
    {
      name: 'Home',
      url: routes.dashboard,
      icon: <HomeIcon className="size-4" />,
    },
    {
      name: 'Budget',
      url: routes.budget,
      icon: <PiggyBankIcon className="size-4" />,
    },
    {
      name: 'Transactions',
      url: routes.transactions,
      icon: <WalletIcon className="size-4" />,
    },
    {
      name: 'Stats',
      url: routes.stats,
      icon: <BarChart3Icon className="size-4" />,
    },
    {
      name: 'Goals',
      url: routes.goals,
      icon: <TargetIcon className="size-4" />,
    },
  ]

  const otherLinks = [
    {
      name: 'Categories',
      url: routes.categories,
      icon: <TagIcon className="size-4" />,
    },
    {
      name: 'Settings',
      url: routes.settings,
      icon: <SettingsIcon className="size-4" />,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href={routes.dashboard}
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
        <DashboardLinks groupLabel="Menu" items={menuLinks} />
        <DashboardLinks groupLabel="Other" items={otherLinks} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
