'use client'

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
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete goal</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Are you sure you want to delete{' '}
          <span className="text-foreground font-medium">{goalName}</span>? This
          action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
