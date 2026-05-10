'use client'

import type { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@finiq/ui/components/dialog'

interface CrudDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  trigger?: ReactNode
  children: ReactNode
}

export function CrudDialog({
  open,
  onOpenChange,
  title,
  trigger,
  children,
}: CrudDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
