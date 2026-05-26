import { createContext, useContext } from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { CrudDialog } from '@/components/shared/crud-dialog'

const DialogContext = createContext(false)

vi.mock('@finiq/ui/components/dialog', () => ({
  Dialog: ({ children, open }: any) => (
    <DialogContext.Provider value={open}>
      <div>{children}</div>
    </DialogContext.Provider>
  ),
  DialogContent: ({ children }: any) => {
    const open = useContext(DialogContext)
    return open ? <div data-testid="content">{children}</div> : null
  },
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogTrigger: ({ children }: any) => (
    <div data-testid="trigger">{children}</div>
  ),
}))

describe('CrudDialog', () => {
  it('should render the title when open', () => {
    render(
      <CrudDialog open={true} onOpenChange={vi.fn()} title="Create item">
        <form>form content</form>
      </CrudDialog>,
    )

    expect(screen.getByText('Create item')).toBeInTheDocument()
  })

  it('should render children when open', () => {
    render(
      <CrudDialog open={true} onOpenChange={vi.fn()} title="Edit">
        <form data-testid="form" />
      </CrudDialog>,
    )

    expect(screen.getByTestId('form')).toBeInTheDocument()
  })

  it('should not render content when closed', () => {
    render(
      <CrudDialog open={false} onOpenChange={vi.fn()} title="Hidden">
        <span>invisible</span>
      </CrudDialog>,
    )

    expect(screen.queryByText('invisible')).not.toBeInTheDocument()
  })

  it('should render trigger element when provided', () => {
    render(
      <CrudDialog
        open={false}
        onOpenChange={vi.fn()}
        title="With trigger"
        trigger={<button>Open me</button>}
      >
        <span>content</span>
      </CrudDialog>,
    )

    expect(screen.getByTestId('trigger')).toBeInTheDocument()
  })
})
