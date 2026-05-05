'use client'

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
import { ResetPasswordForm } from '@/app/(auth)/auth/reset-password/_components/reset-password-form'
import { routes } from '@/lib/routes'

export default function ResetPasswordPage() {
  const { t } = useTranslation()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle>{t('auth.resetPasswordTitle')}</CardTitle>
        <CardDescription>{t('auth.resetPasswordDescription')}</CardDescription>
      </CardHeader>

      <CardContent>
        <ResetPasswordForm />
      </CardContent>

      <CardFooter className="justify-center">
        <Link
          href={routes.login}
          className="text-primary text-sm hover:underline"
        >
          {t('auth.resetPasswordBackToSignIn')}
        </Link>
      </CardFooter>
    </Card>
  )
}
