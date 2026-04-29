'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@finiq/ui/lib/utils'
import { navItems } from '@/components/layout/nav-items'

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-background fixed bottom-0 left-0 right-0 z-50 border-t md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <item.icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
