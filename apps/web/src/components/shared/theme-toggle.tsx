'use client'

import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

import { Button } from '@finiq/ui/components/button'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={t('sidebar.toggleTheme')}
      data-testid="theme-toggle"
      disabled={!mounted}
    >
      <SunIcon className="size-4 dark:hidden" />
      <MoonIcon className="hidden size-4 dark:block" />
    </Button>
  )
}
