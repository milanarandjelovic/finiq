'use client'

import { useRouter } from 'next/navigation'
import { EllipsisVerticalIcon, LogOutIcon, UserCircleIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@finiq/ui/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@finiq/ui/components/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@finiq/ui/components/sidebar'
import { useUserProfileControllerFindOne } from '@/api/__generated__/user-profile/user-profile'
import { useAuth } from '@/context/auth-context'
import { getInitials } from '@/lib/get-initials'
import { ROUTES } from '@/util/routes'

export function SidebarUserMenu() {
  const { logout } = useAuth()
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { data } = useUserProfileControllerFindOne()
  const user = data?.status === 200 ? data.data.data?.user : undefined
  const initials = getInitials(user?.name)

  function handleLogout() {
    logout()
    router.push(ROUTES.LOGIN)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              data-testid="user-menu-trigger"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg">
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
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg">
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
                <a href={ROUTES.PROFILE}>
                  <UserCircleIcon />
                  Profile
                </a>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              data-testid="user-menu-sign-out"
            >
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
