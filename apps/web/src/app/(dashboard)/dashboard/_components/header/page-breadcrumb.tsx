'use client'

import { usePathname } from 'next/navigation'

import { routeNames, routes } from '@/lib/routes'

const PAGE_TITLES = Object.fromEntries(
  (Object.keys(routes) as (keyof typeof routes)[]).map((key) => [
    routes[key],
    routeNames[key],
  ]),
) as Record<string, string>

export function PageBreadcrumb() {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? routeNames.dashboard

  return <h1 className="text-foreground text-xl font-semibold">{title}</h1>
}
