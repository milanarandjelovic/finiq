'use client'

import { useTranslation } from 'react-i18next'

import { Button } from '@finiq/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@finiq/ui/components/dialog'

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('transactions.deleteTransaction')}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          {t('transactions.deleteTransactionConfirm')}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('general.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await onConfirm()
              onOpenChange(false)
            }}
          >
            {t('general.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
