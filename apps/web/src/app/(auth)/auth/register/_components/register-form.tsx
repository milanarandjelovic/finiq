'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { registerFormSchema, type RegisterFormValues } from '@finiq/schemas'
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
import { useAuthControllerRegister } from '@/api/__generated__/auth/auth'
import { formMutationOptions } from '@/lib/mutation'
import { ROUTES } from '@/util/routes'

export function RegisterForm() {
  const { t } = useTranslation()
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema(t)),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  })

  const { mutateAsync: register, isPending } = useAuthControllerRegister(
    formMutationOptions(form, () => {
      toast.success(t('auth.registerSuccess'))
      router.push(ROUTES.LOGIN)
    }),
  )

  const handleSubmit = async (values: RegisterFormValues): Promise<void> => {
    await register({ data: values })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.registerFullName')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('auth.registerFullNamePlaceholder')}
                  autoComplete="name"
                  data-testid="register-name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  data-testid="register-email"
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
              <FormLabel>{t('general.password')}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t('auth.passwordPlaceholder')}
                  autoComplete="new-password"
                  data-testid="register-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.registerConfirmPassword')}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t('auth.passwordPlaceholder')}
                  autoComplete="new-password"
                  data-testid="register-confirm-password"
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
          data-testid="register-submit"
        >
          {t('auth.registerSubmit')}
        </LoadingButton>
      </form>
    </Form>
  )
}
