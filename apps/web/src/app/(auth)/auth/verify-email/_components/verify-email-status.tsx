'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@finiq/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@finiq/ui/components/card'
import { Spinner } from '@finiq/ui/components/spinner'
import { authControllerVerifyEmail } from '@/api/__generated__/auth/auth'
import type { VerifyEmailPayloadDto } from '@/api/__generated__/models'
import { ROUTES } from '@/util/routes'

type Status = 'verifying' | 'success' | 'error'

export function VerifyEmailStatus() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<Status>('verifying')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMsg(t('auth.verifyEmailInvalidLink'))

      return
    }

    authControllerVerifyEmail({ token } as unknown as VerifyEmailPayloadDto)
      .then(() => setStatus('success'))
      .catch((err: unknown) => {
        const errData = err as { data?: { message?: string }; message?: string }
        setErrorMsg(
          errData?.data?.message ??
            errData?.message ??
            t('auth.verifyEmailFailed'),
        )
        setStatus('error')
      })
  }, [token, t])

  if (status === 'verifying') {
    return (
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>{t('auth.verifyEmailVerifying')}</CardTitle>
          <CardDescription>{t('auth.verifyEmailPleaseWait')}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-4">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  if (status === 'success') {
    return (
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="mb-2 flex justify-center">
            <CheckCircle className="size-12 text-green-500" />
          </div>
          <CardTitle>{t('auth.verifyEmailSuccess')}</CardTitle>
          <CardDescription>
            {t('auth.verifyEmailSuccessDescription')}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button onClick={() => router.push(ROUTES.LOGIN)}>
            {t('auth.verifyEmailBackToSignIn')}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm text-center">
      <CardHeader>
        <div className="mb-2 flex justify-center">
          <XCircle className="text-destructive size-12" />
        </div>
        <CardTitle>{t('auth.verifyEmailFailed')}</CardTitle>
        <CardDescription>{errorMsg}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-center">
        <Link
          href={ROUTES.LOGIN}
          className="text-primary text-sm hover:underline"
        >
          {t('auth.verifyEmailBackToSignIn')}
        </Link>
      </CardFooter>
    </Card>
  )
}
