import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { MobileNav } from '@/components/layout/mobile-nav'

const mockPathname = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'sidebar.dashboard': 'Dashboard',
        'sidebar.transactions': 'Transactions',
        'sidebar.budget': 'Budget',
        'sidebar.categories': 'Categories',
        'sidebar.goals': 'Goals',
        'sidebar.statistics': 'Statistics',
      }
      return map[key] ?? key
    },
  }),
}))

vi.mock('lucide-react', () => ({
  LayoutDashboard: () => <span>LayoutDashboard</span>,
  Wallet: () => <span>Wallet</span>,
  PiggyBank: () => <span>PiggyBank</span>,
  Tag: () => <span>Tag</span>,
  Target: () => <span>Target</span>,
  BarChart3: () => <span>BarChart3</span>,
  Settings: () => <span>Settings</span>,
  User: () => <span>User</span>,
}))

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
