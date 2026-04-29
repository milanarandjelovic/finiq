import { SettingsForm } from '@/app/(dashboard)/dashboard/settings/_components/settings-form'

export default function SettingsPage() {
  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <SettingsForm />
    </div>
  )
}
