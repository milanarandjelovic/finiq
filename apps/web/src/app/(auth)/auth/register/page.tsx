import Link from 'next/link'

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
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Start managing your finances with Finiq
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm />

        <p className="text-muted-foreground mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href={routes.login} className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
