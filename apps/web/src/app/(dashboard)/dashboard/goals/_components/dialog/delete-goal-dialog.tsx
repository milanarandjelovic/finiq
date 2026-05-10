'use client'

import { useTranslation } from 'react-i18next'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'

interface DeleteGoalDialogProps {
  open: boolean
  goalName: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteGoalDialog({
  open,
  goalName,
  onConfirm,
  onCancel,
}: DeleteGoalDialogProps) {
  const { t } = useTranslation()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(o) => !o && onCancel()}
      title={t('goals.deleteGoal')}
      description={t('goals.deleteConfirm', { name: goalName })}
      onConfirm={onConfirm}
    />
  )
}
