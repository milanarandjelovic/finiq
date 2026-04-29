'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { loginFormSchema, type LoginFormValues } from '@finiq/schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@finiq/ui/components/form'
import { Input } from '@finiq/ui/components/input'
import { LoadingButton } from '@finiq/ui/components/loading-button'
import { PasswordInput } from '@finiq/ui/components/password-input'
import { useAuthControllerLogin } from '@/api/__generated__/auth/auth'
import { useAuth } from '@/context/auth-context'
import { formMutationOptions } from '@/lib/form-validation'
import { routes } from '@/lib/routes'

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutateAsync: submitLogin, isPending } = useAuthControllerLogin(
    formMutationOptions(form, (response) => {
      if (response.status !== 200) return
      const { accessToken, refreshToken } = response.data.data!
      login(accessToken, refreshToken)
      router.push(routes.dashboard)
    }),
  )

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    await submitLogin({ data: values })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href={routes.forgotPassword}
                  className="text-primary text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton type="submit" isLoading={isPending} className="w-full">
          Sign in
        </LoadingButton>
      </form>
    </Form>
  )
}
