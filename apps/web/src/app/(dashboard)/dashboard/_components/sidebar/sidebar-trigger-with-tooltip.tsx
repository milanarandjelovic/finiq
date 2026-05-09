'use client'

import { useTranslation } from 'react-i18next'

import { SidebarTrigger } from '@finiq/ui/components/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@finiq/ui/components/tooltip'

export function SidebarTriggerWithTooltip() {
  const { t } = useTranslation()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarTrigger className="-ml-1" />
        </TooltipTrigger>
        <TooltipContent side="right">
          {t('sidebar.toggleSidebar')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
