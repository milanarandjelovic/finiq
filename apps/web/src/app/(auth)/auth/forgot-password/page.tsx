'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@finiq/ui/components/card'
import { ForgotPasswordForm } from '@/app/(auth)/auth/forgot-password/_components/forgot-password-form'
import { ROUTES } from '@/util/routes'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [sentTo, setSentTo] = useState<string | null>(null)

  if (sentTo) {
    return (
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>{t('auth.forgotPasswordCheckEmailTitle')}</CardTitle>
          <CardDescription>
            {t('auth.forgotPasswordCheckEmailDescription')}{' '}
            <strong>{sentTo}</strong>
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link
            href={ROUTES.LOGIN}
            className="text-primary text-sm hover:underline"
          >
            {t('auth.forgotPasswordBackToSignIn')}
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle>{t('auth.forgotPasswordTitle')}</CardTitle>
        <CardDescription>{t('auth.forgotPasswordDescription')}</CardDescription>
      </CardHeader>

      <CardContent>
        <ForgotPasswordForm onSuccess={(email) => setSentTo(email)} />
      </CardContent>

      <CardFooter className="justify-center">
        <Link
          href={ROUTES.LOGIN}
          className="text-primary text-sm hover:underline"
        >
          {t('auth.forgotPasswordBackToSignIn')}
        </Link>
      </CardFooter>
    </Card>
  )
}
