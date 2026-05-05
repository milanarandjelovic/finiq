'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from '@finiq/schemas'
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
import { useAuthControllerForgotPassword } from '@/api/__generated__/auth/auth'
import { formMutationOptions } from '@/lib/form-validation'

export function ForgotPasswordForm({
  onSuccess,
}: {
  onSuccess: (email: string) => void
}) {
  const { t } = useTranslation()
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const { mutateAsync: forgotPassword, isPending } =
    useAuthControllerForgotPassword(
      formMutationOptions(form, (response) => {
        if (response.status === 200) {
          onSuccess(response.data.data?.user.email ?? '')
        }
      }),
    )

  const handleSubmit = async (
    values: ForgotPasswordFormValues,
  ): Promise<void> => {
    await forgotPassword({ data: values })
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
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton type="submit" isLoading={isPending} className="w-full">
          {t('auth.forgotPasswordSubmit')}
        </LoadingButton>
      </form>
    </Form>
  )
}
