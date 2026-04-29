'use client'

import { Avatar, AvatarFallback } from '@finiq/ui/components/avatar'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@finiq/ui/components/tabs'
import { useUserProfileControllerFindOne } from '@/api/__generated__/user-profile/user-profile'
import { ChangePasswordForm } from '@/app/(dashboard)/dashboard/profile/_components/change-password-form'
import { PersonalInformationForm } from '@/app/(dashboard)/dashboard/profile/_components/personal-information-form'
import { getInitials } from '@/lib/get-initials'

export default function ProfilePage() {
  const { data } = useUserProfileControllerFindOne()
  const user = data?.status === 200 ? data.data.data?.user : undefined

  const initials = getInitials(user?.name)

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{user?.name}</p>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal information</TabsTrigger>
          <TabsTrigger value="password">Change password</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInformationForm />
        </TabsContent>

        <TabsContent value="password">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
