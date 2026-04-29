'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { PageSpinner } from '@finiq/ui/components/spinner'
import { useAuth } from '@/context/auth-context'
import { routes } from '@/lib/routes'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(routes.dashboard)
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <PageSpinner />
  }

  return (
    <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center p-4">
      {children}
    </div>
  )
}
