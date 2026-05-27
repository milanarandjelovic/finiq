import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'

const mockOnOpenChange = vi.fn()
const mockOnConfirm = vi.fn()

vi.mock('react-i18next', async () => {
  const { createI18nMock } =
    await import('@/__tests__/unit/__mocks__/react-i18next')
  return createI18nMock({
    'general.cancel': 'Cancel',
    'general.delete': 'Delete',
  })
})

vi.mock(
  '@finiq/ui/components/button',
  async () => import('@/__tests__/unit/__mocks__/button'),
)

vi.mock('@finiq/ui/components/dialog', () => ({
  Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
}))

describe('ConfirmDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the title and description', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        title="Delete item?"
        description="This action cannot be undone."
        onConfirm={mockOnConfirm}
      />,
    )

    expect(screen.getByText('Delete item?')).toBeInTheDocument()
    expect(
      screen.getByText('This action cannot be undone.'),
    ).toBeInTheDocument()
  })

  it('should render cancel and confirm buttons', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        title="Delete?"
        description="Sure?"
        onConfirm={mockOnConfirm}
      />,
    )

    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('should call onConfirm and close when confirm is clicked', async () => {
    mockOnConfirm.mockResolvedValue(undefined)

    render(
      <ConfirmDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        title="Delete?"
        description="Sure?"
        onConfirm={mockOnConfirm}
      />,
    )

    await userEvent.click(screen.getByText('Delete'))

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should call onOpenChange with false when cancel is clicked', async () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        title="Delete?"
        description="Sure?"
        onConfirm={mockOnConfirm}
      />,
    )

    await userEvent.click(screen.getByText('Cancel'))

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })
})
