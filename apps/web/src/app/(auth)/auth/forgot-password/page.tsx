'use client'

import { useState } from 'react'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@finiq/ui/components/card'
import { ForgotPasswordForm } from '@/app/(auth)/auth/forgot-password/_components/forgot-password-form'
import { routes } from '@/lib/routes'

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null)

  if (sentTo) {
    return (
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a reset link to <strong>{sentTo}</strong>
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link
            href={routes.login}
            className="text-primary text-sm hover:underline"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ForgotPasswordForm onSuccess={(email) => setSentTo(email)} />
      </CardContent>

      <CardFooter className="justify-center">
        <Link
          href={routes.login}
          className="text-primary text-sm hover:underline"
        >
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
