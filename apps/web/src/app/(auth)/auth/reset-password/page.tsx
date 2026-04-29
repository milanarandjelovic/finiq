import Link from 'next/link'

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
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle>Set new password</CardTitle>
        <CardDescription>
          Choose a strong password for your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ResetPasswordForm />
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
