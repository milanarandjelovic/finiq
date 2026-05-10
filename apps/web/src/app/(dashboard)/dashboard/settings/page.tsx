'use client'

import { useTranslation } from 'react-i18next'

import { SettingsForm } from '@/app/(dashboard)/dashboard/settings/_components/settings-form'

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">{t('settings.title')}</h1>
      <SettingsForm />
    </div>
  )
}
