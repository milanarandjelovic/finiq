import { ReactNode } from 'react'
import { cookies } from 'next/headers'

import { SidebarInset, SidebarProvider } from '@finiq/ui/components/sidebar'
import { AuthGuard } from '@/app/(dashboard)/dashboard/_components/auth-guard'
import { DashboardHeader } from '@/app/(dashboard)/dashboard/_components/header/dashboard-header'
import { DashboardSidebar } from '@/app/(dashboard)/dashboard/_components/sidebar/dashboard-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar />

        <SidebarInset>
          <DashboardHeader />

          <div className="flex flex-1 flex-col gap-6 p-6 pt-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
