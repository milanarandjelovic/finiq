'use client'

import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback } from '@finiq/ui/components/avatar'
import { Button } from '@finiq/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@finiq/ui/components/dropdown-menu'
import { useUserProfileControllerFindOne } from '@/api/__generated__/user-profile/user-profile'
import { PageBreadcrumb } from '@/app/(dashboard)/dashboard/_components/header/page-breadcrumb'
import { SidebarTriggerWithTooltip } from '@/app/(dashboard)/dashboard/_components/sidebar/sidebar-trigger-with-tooltip'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { useAuth } from '@/context/auth-context'
import { getInitials } from '@/lib/get-initials'
import { routes } from '@/lib/routes'

export function DashboardHeader() {
  const { logout } = useAuth()
  const router = useRouter()
  const { data } = useUserProfileControllerFindOne()
  const user = data?.status === 200 ? data.data.data?.user : undefined
  const initials = getInitials(user?.name)

  function handleLogout() {
    logout()
    router.push(routes.login)
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 transition-[width,height] ease-linear">
      <SidebarTriggerWithTooltip />

      <div className="flex flex-1 items-center">
        <PageBreadcrumb />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-accent flex h-8 items-center gap-2 rounded-full px-2"
            >
              <Avatar className="size-7 rounded-full">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground rounded-full text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {user?.name && (
                <span className="hidden text-sm font-medium sm:block">
                  {user.name}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Avatar className="size-8 rounded-full">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground rounded-full text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {user?.name && (
                    <span className="truncate font-medium">{user.name}</span>
                  )}
                  {user?.email && (
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href={routes.profile}>Profile</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={routes.settings}>Settings</a>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
