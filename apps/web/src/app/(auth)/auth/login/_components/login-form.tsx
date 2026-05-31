'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
import { formMutationOptions } from '@/lib/mutation'
import { ROUTES } from '@/util/routes'

export function LoginForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const { login } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema(t)),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutateAsync: submitLogin, isPending } = useAuthControllerLogin(
    formMutationOptions(form, (response) => {
      if (response.status !== 200) {
        return
      }

      const { accessToken, refreshToken } = response.data.data!
      login(accessToken, refreshToken)
      router.push(ROUTES.DASHBOARD)
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
              <FormLabel>{t('general.email')}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  autoComplete="email"
                  data-testid="login-email"
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
                <FormLabel>{t('general.password')}</FormLabel>
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className="text-primary text-sm hover:underline"
                  data-testid="login-forgot-password"
                >
                  {t('auth.loginForgotPassword')}
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  placeholder={t('auth.passwordPlaceholder')}
                  autoComplete="current-password"
                  data-testid="login-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          type="submit"
          isLoading={isPending}
          className="w-full"
          data-testid="login-submit"
        >
          {t('auth.loginSubmit')}
        </LoadingButton>
      </form>
    </Form>
  )
}
