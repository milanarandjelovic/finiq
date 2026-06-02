'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOutIcon, SettingsIcon, UserCircleIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@finiq/ui/components/dropdown-menu'
import { useAuth } from '@/context/auth-context'
import { getInitials } from '@/lib/get-initials'
import { ROUTES } from '@/util/routes'

type HeaderUserMenuProps = {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const router = useRouter()
  const { name = null, email = null } = user
  const initials = getInitials(name)

  function handleLogout() {
    logout()
    router.push(ROUTES.LOGIN)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-sidebar-primary text-sidebar-primary-foreground flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-xs font-medium"
          aria-label="User profile"
          data-testid="user-menu-trigger"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-56 rounded-lg" align="end">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium">
              {initials}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              {name && <span className="truncate font-medium">{name}</span>}
              {email && (
                <span className="text-muted-foreground truncate text-xs">
                  {email}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.PROFILE}
              className="cursor-pointer"
              data-testid="header-profile-link"
            >
              <UserCircleIcon />
              {t('userMenu.profile')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.SETTINGS}
              className="cursor-pointer"
              data-testid="header-settings-link"
            >
              <SettingsIcon />
              {t('sidebar.settings')}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleLogout}
          data-testid="user-menu-sign-out"
        >
          <LogOutIcon />
          {t('userMenu.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
