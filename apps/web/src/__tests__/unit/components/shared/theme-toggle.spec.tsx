import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { ThemeToggle } from '@/components/shared/theme-toggle'

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }),
}))

vi.mock(
  'react-i18next',
  async () => import('@/__tests__/unit/__mocks__/react-i18next'),
)

vi.mock(
  '@finiq/ui/components/button',
  async () => import('@/__tests__/unit/__mocks__/button'),
)

vi.mock(
  'lucide-react',
  async () => import('@/__tests__/unit/__mocks__/lucide-react'),
)

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
