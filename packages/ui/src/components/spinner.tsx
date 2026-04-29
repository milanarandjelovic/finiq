import { cn } from '@finiq/ui/lib/utils'

interface SpinnerProps {
  className?: string
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'border-primary size-8 animate-spin rounded-full border-4 border-t-transparent',
        className,
      )}
    />
  )
}

export function PageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner />
    </div>
  )
}
