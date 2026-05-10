'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'

import { Toaster } from '@finiq/ui/components/sonner'
import { TooltipProvider } from '@finiq/ui/components/tooltip'
import { AuthProvider } from '@/context/auth-context'
import i18n, { changeLanguage, detectUserLanguage } from '@/i18n'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      }),
  )

  const langRef = useRef(false)

  useEffect(() => {
    if (langRef.current) return
    langRef.current = true
    detectUserLanguage().then(changeLanguage)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <TooltipProvider>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </TooltipProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}
