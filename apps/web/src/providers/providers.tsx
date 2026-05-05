'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { I18nextProvider } from 'react-i18next'

import { THEME_COOKIE_NAME } from '@finiq/shared'
import { Toaster } from '@finiq/ui/components/sonner'
import { TooltipProvider } from '@finiq/ui/components/tooltip'
import { AuthProvider } from '@/context/auth-context'
import i18n, { changeLanguage, detectUserLanguage, initI18n } from '@/i18n'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      }),
  )

  const [i18nReady, setI18nReady] = useState(false)
  const initRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || initRef.current) return
    initRef.current = true

    const initialize = async () => {
      await initI18n()
      const lang = await detectUserLanguage()
      await changeLanguage(lang)
      setI18nReady(true)
    }

    initialize()
  }, [])

  if (!i18nReady) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey={THEME_COOKIE_NAME}
      >
        <I18nextProvider i18n={i18n}>
          <TooltipProvider>
            <AuthProvider>
              {children}
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </TooltipProvider>
        </I18nextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
