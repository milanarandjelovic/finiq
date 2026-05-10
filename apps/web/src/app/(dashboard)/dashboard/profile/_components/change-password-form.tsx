'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  changePasswordFormSchema,
  type ChangePasswordFormValues,
} from '@finiq/schemas'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@finiq/ui/components/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@finiq/ui/components/form'
import { LoadingButton } from '@finiq/ui/components/loading-button'
import { PasswordInput } from '@finiq/ui/components/password-input'
import { useUserPasswordControllerUpdate } from '@/api/__generated__/user-password/user-password'
import { formMutationOptions } from '@/lib/mutation'

export function ChangePasswordForm() {
  const { t } = useTranslation()
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirmation: '',
    },
  })

  const { mutateAsync: updatePassword, isPending } =
    useUserPasswordControllerUpdate(
      formMutationOptions(form, () => {
        toast.success(t('profile.passwordChanged'))
        form.reset()
      }),
    )

  const handleSubmit = async (
    values: ChangePasswordFormValues,
  ): Promise<void> => {
    await updatePassword({
      data: {
        password: values.currentPassword,
        newPassword: values.password,
        passwordConfirmation: values.passwordConfirmation,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.changePassword')}</CardTitle>
        <CardDescription>
          {t('profile.changePasswordDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.currentPassword')}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
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
                  <FormLabel>{t('profile.newPassword')}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
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
                  <FormLabel>{t('profile.confirmNewPassword')}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" isLoading={isPending}>
              {t('profile.changePasswordSubmit')}
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
