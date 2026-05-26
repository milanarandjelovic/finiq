import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { QueryError } from '@/components/shared/query-error'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'general.somethingWentWrong': 'Something went wrong',
        'general.tryAgain': 'Try again',
      })[key] ?? key,
  }),
}))

vi.mock('@finiq/ui/components/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

vi.mock('lucide-react', () => ({
  AlertCircle: () => <span>AlertCircle</span>,
}))

describe('QueryError', () => {
  it('should render default error message when no message prop', () => {
    render(<QueryError />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should render custom error message when provided', () => {
    render(<QueryError message="Custom error" />)

    expect(screen.getByText('Custom error')).toBeInTheDocument()
  })

  it('should not render retry button when onRetry is not provided', () => {
    render(<QueryError />)

    expect(screen.queryByText('Try again')).not.toBeInTheDocument()
  })

  it('should render retry button when onRetry is provided', () => {
    render(<QueryError onRetry={() => {}} />)

    expect(screen.getByText('Try again')).toBeInTheDocument()
  })

  it('should call onRetry when retry button is clicked', async () => {
    const onRetry = vi.fn()
    render(<QueryError onRetry={onRetry} />)
    await userEvent.click(screen.getByText('Try again'))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('should render AlertCircle icon', () => {
    render(<QueryError />)

    expect(screen.getByText('AlertCircle')).toBeInTheDocument()
  })
})
