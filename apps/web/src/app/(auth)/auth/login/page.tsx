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
import { LoginForm } from '@/app/(auth)/auth/login/_components/login-form'
import { routes } from '@/lib/routes'

export default function LoginPage() {
  const { t } = useTranslation()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle>{t('auth.loginTitle')}</CardTitle>
        <CardDescription>{t('auth.loginDescription')}</CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />

        <p className="text-muted-foreground mt-4 text-center text-sm">
          {t('auth.loginNoAccount')}{' '}
          <Link href={routes.register} className="text-primary hover:underline">
            {t('auth.signUp')}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
