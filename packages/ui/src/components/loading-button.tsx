'use client'

import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { Slot } from 'radix-ui'

import { buttonVariants } from '@finiq/ui/components/button'
import { cn } from '@finiq/ui/lib/utils'

interface LoadingButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

function LoadingButton({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  children,
  ...props
}: LoadingButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        'disabled:cursor-not-allowed',
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2
          className={cn('h-4 w-4 animate-spin', size !== 'icon' && 'mr-2')}
        />
      )}
      {children}
    </Comp>
  )
}

export { LoadingButton }
export type { LoadingButtonProps }
