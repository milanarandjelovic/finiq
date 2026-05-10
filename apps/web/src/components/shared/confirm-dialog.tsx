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

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">{description}</p>
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
