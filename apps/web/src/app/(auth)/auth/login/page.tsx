import Link from 'next/link'

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
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your Finiq account</CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />

        <p className="text-muted-foreground mt-4 text-center text-sm">
          No account?{' '}
          <Link href={routes.register} className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
