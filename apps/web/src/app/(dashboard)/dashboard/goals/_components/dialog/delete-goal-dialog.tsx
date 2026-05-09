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
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('goals.deleteGoal')}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          {t('goals.deleteConfirm', { name: goalName })}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t('general.cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t('general.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
