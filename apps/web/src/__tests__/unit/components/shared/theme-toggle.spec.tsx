import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { ThemeToggle } from '@/components/shared/theme-toggle'

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('@finiq/ui/components/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock('lucide-react', () => ({
  SunIcon: () => <span>SunIcon</span>,
  MoonIcon: () => <span>MoonIcon</span>,
}))

describe('ThemeToggle', () => {
  it('should render without crashing', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should have correct aria-label', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'sidebar.toggleTheme',
    )
  })
})
