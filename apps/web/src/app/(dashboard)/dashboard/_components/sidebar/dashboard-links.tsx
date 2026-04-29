'use client'

import { JSX } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@finiq/ui/components/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@finiq/ui/components/sidebar'

type SubItem = {
  name: string
  url: string
}

export type DashboardLinksProps = {
  groupLabel?: string
  items?: {
    name: string
    url?: string
    icon: JSX.Element
    onClick?: () => void
    items?: SubItem[]
  }[]
}

export function DashboardLinks({ groupLabel, items }: DashboardLinksProps) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  function closeMobile() {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup>
      {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
      <SidebarMenu>
        {items?.map((item) => {
          if (item.items && item.items.length > 0) {
            const isChildActive = item.items.some((sub) => pathname === sub.url)

            return (
              <Collapsible
                key={item.name}
                asChild
                defaultOpen={isChildActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.name}
                      isActive={isChildActive}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((sub) => (
                        <SidebarMenuSubItem key={sub.name}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === sub.url}
                          >
                            <Link
                              href={sub.url}
                              prefetch={false}
                              onClick={closeMobile}
                            >
                              {sub.name}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          const isActive = pathname === item.url

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                tooltip={item.name}
                isActive={isActive}
                asChild
              >
                {item.onClick ? (
                  <button
                    onClick={() => {
                      item.onClick?.()
                      closeMobile()
                    }}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                ) : item.url ? (
                  <Link href={item.url} prefetch={false} onClick={closeMobile}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ) : null}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
