'use client'

import { useUserProfileControllerFindOne } from '@/api/__generated__/user-profile/user-profile'
import { HeaderUserMenu } from '@/app/(dashboard)/dashboard/_components/header/header-user-menu'
import { PageBreadcrumb } from '@/app/(dashboard)/dashboard/_components/header/page-breadcrumb'
import { SidebarTriggerWithTooltip } from '@/app/(dashboard)/dashboard/_components/sidebar/sidebar-trigger-with-tooltip'
import { LanguagePicker } from '@/components/shared/language-picker'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export function DashboardHeader() {
  const { data } = useUserProfileControllerFindOne()
  const user = data?.status === 200 ? data.data.data?.user : undefined

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 transition-[width,height] ease-linear">
      <SidebarTriggerWithTooltip />

      <div className="flex flex-1 items-center">
        <PageBreadcrumb />
      </div>

      <div className="flex items-center gap-2">
        <LanguagePicker />
        <ThemeToggle />
        <HeaderUserMenu user={user ?? {}} />
      </div>
    </header>
  )
}
