import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { MobileNav } from '@/components/layout/mobile-nav'

const mockPathname = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

vi.mock('react-i18next', async () => {
  const { createI18nMock } =
    await import('@/__tests__/unit/__mocks__/react-i18next')
  return createI18nMock({
    'sidebar.dashboard': 'Dashboard',
    'sidebar.transactions': 'Transactions',
    'sidebar.budget': 'Budget',
    'sidebar.categories': 'Categories',
    'sidebar.goals': 'Goals',
    'sidebar.statistics': 'Statistics',
  })
})

vi.mock(
  'lucide-react',
  async () => import('@/__tests__/unit/__mocks__/lucide-react'),
)

describe('MobileNav', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/dashboard')
  })

  it('should render nav links for all nav items', () => {
    render(<MobileNav />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Transactions')).toBeInTheDocument()
    expect(screen.getByText('Budget')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('Goals')).toBeInTheDocument()
    expect(screen.getByText('Statistics')).toBeInTheDocument()
  })

  it('should translate label keys', () => {
    render(<MobileNav />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Statistics')).toBeInTheDocument()
  })

  it('should render icons for each link', () => {
    render(<MobileNav />)

    expect(screen.getByText('LayoutDashboard')).toBeInTheDocument()
    expect(screen.getByText('Wallet')).toBeInTheDocument()
  })
})
