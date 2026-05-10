'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { PageSpinner } from '@finiq/ui/components/spinner'
import { useAuth } from '@/context/auth-context'
import { ROUTES } from '@/util/routes'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN)
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <PageSpinner />
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
