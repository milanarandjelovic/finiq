'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { profileFormSchema, type ProfileFormValues } from '@finiq/schemas'
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
import { Input } from '@finiq/ui/components/input'
import { LoadingButton } from '@finiq/ui/components/loading-button'
import {
  useUserProfileControllerFindOne,
  useUserProfileControllerUpdate,
} from '@/api/__generated__/user-profile/user-profile'
import { formMutationOptions } from '@/lib/form-validation'

export function PersonalInformationForm() {
  const { data: profileData, refetch } = useUserProfileControllerFindOne()
  const user =
    profileData?.status === 200 ? profileData.data.data?.user : undefined

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({ name: user.name, email: user.email })
    }
  }, [user, form])

  const { mutateAsync: updateProfile, isPending } =
    useUserProfileControllerUpdate(
      formMutationOptions(form, (response) => {
        if (response.status !== 200) {
            return
        }

        refetch()
        toast.success('Profile updated')
      }),
    )

  const handleSubmit = async (values: ProfileFormValues): Promise<void> => {
    await updateProfile({ data: { name: values.name } })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>Update your name and email.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" isLoading={isPending}>
              Save changes
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
