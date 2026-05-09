'use client'

import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { PATH_TO_ROUTE_KEY } from '@/util/routes'

export function PageBreadcrumb() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const routeKey = PATH_TO_ROUTE_KEY[pathname] ?? 'dashboard'

  return (
    <h1 className="text-foreground text-xl font-semibold">
      {t(`sidebar.${routeKey}`)}
    </h1>
  )
}
