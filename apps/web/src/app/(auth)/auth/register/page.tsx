'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@finiq/ui/components/card'
import { RegisterForm } from '@/app/(auth)/auth/register/_components/register-form'
import { routes } from '@/lib/routes'

export default function RegisterPage() {
  const { t } = useTranslation()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle>{t('auth.registerTitle')}</CardTitle>
        <CardDescription>{t('auth.registerDescription')}</CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm />

        <p className="text-muted-foreground mt-4 text-center text-sm">
          {t('auth.registerHasAccount')}{' '}
          <Link href={routes.login} className="text-primary hover:underline">
            {t('auth.signIn')}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
