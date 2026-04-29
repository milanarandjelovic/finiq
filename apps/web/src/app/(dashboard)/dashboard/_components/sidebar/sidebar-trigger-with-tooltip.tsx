'use client'

import { SidebarTrigger } from '@finiq/ui/components/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@finiq/ui/components/tooltip'

export function SidebarTriggerWithTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarTrigger className="-ml-1" />
        </TooltipTrigger>
        <TooltipContent side="right">Toggle sidebar</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
