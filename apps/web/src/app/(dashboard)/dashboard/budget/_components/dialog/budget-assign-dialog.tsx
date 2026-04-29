'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { budgetFormSchema, type BudgetFormValues } from '@finiq/schemas'
import { Button } from '@finiq/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@finiq/ui/components/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@finiq/ui/components/form'
import { Input } from '@finiq/ui/components/input'

interface BudgetAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryName: string
  categoryEmoji: string
  currentAmount: number
  onSave: (amount: number) => void
}

export function BudgetAssignDialog({
  open,
  onOpenChange,
  categoryName,
  categoryEmoji,
  currentAmount,
  onSave,
}: BudgetAssignDialogProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: { amount: currentAmount },
  })

  useEffect(() => {
    if (open) {
      form.reset({ amount: currentAmount })
    }
  }, [open, currentAmount, form])

  function handleSubmit(values: BudgetFormValues) {
    onSave(values.amount)
    onOpenChange(false)
  }

  const isEditing = currentAmount > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{categoryEmoji}</span>
            {isEditing ? 'Edit budget' : 'Assign budget'} - {categoryName}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Save changes' : 'Assign'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
