'use client'

import { useTranslation } from 'react-i18next'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'

export function DeleteTransactionDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: () => Promise<void>
}) {
  const { t } = useTranslation()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('transactions.deleteTransaction')}
      description={t('transactions.deleteTransactionConfirm')}
      onConfirm={onConfirm}
    />
  )
}
