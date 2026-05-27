import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { AppSidebar } from '@/components/layout/app-sidebar'

const mockLogout = vi.fn()
const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
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
    'sidebar.settings': 'Settings',
    'sidebar.profile': 'Profile',
    'sidebar.lightMode': 'Light mode',
    'sidebar.darkMode': 'Dark mode',
    'sidebar.logout': 'Logout',
  })
})

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: vi.fn() }),
}))

vi.mock('@/context/auth-context', () => ({
  useAuth: () => ({ logout: mockLogout }),
}))

vi.mock('@/api/__generated__/user-profile/user-profile', () => ({
  useUserProfileControllerFindOne: () => ({
    data: {
      status: 200,
      data: {
        data: {
          user: {
            name: 'John Doe',
            email: 'john@finiq.test',
          },
        },
      },
    },
  }),
}))

vi.mock('@/lib/get-initials', () => ({
  getInitials: (name: string) => (name ? 'JD' : '?'),
}))

vi.mock('@finiq/ui/components/avatar', () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarFallback: ({ children }: any) => (
    <span data-testid="avatar-fallback">{children}</span>
  ),
}))

vi.mock('@finiq/ui/components/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@finiq/ui/components/sidebar', () => ({
  Sidebar: ({ children }: any) => <aside>{children}</aside>,
  SidebarContent: ({ children }: any) => <div>{children}</div>,
  SidebarFooter: ({ children }: any) => <footer>{children}</footer>,
  SidebarGroup: ({ children }: any) => <div>{children}</div>,
  SidebarGroupContent: ({ children }: any) => <div>{children}</div>,
  SidebarGroupLabel: ({ children }: any) => <div>{children}</div>,
  SidebarHeader: ({ children }: any) => <header>{children}</header>,
  SidebarMenu: ({ children }: any) => <ul>{children}</ul>,
  SidebarMenuButton: ({ children, asChild: _asChild, isActive }: any) => (
    <li data-active={isActive}>{children}</li>
  ),
  SidebarMenuItem: ({ children }: any) => <li>{children}</li>,
}))

vi.mock(
  'lucide-react',
  async () => import('@/__tests__/unit/__mocks__/lucide-react'),
)

describe('AppSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the Finiq logo and brand name', () => {
    render(<AppSidebar />)

    expect(screen.getByText('F')).toBeInTheDocument()
    expect(screen.getByText('Finiq')).toBeInTheDocument()
  })

  it('should render nav links from navItems', () => {
    render(<AppSidebar />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Transactions')).toBeInTheDocument()
    expect(screen.getByText('Budget')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('Goals')).toBeInTheDocument()
    expect(screen.getByText('Statistics')).toBeInTheDocument()
  })

  it('should render bottom nav links from bottomNavItems', () => {
    render(<AppSidebar />)

    expect(screen.getAllByText('Settings').length).toBeGreaterThan(0)
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('should render user avatar with initials', () => {
    render(<AppSidebar />)

    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('JD')
  })

  it('should render user name and email', () => {
    render(<AppSidebar />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@finiq.test')).toBeInTheDocument()
  })

  it('should render theme toggle and logout in dropdown', () => {
    render(<AppSidebar />)

    expect(screen.getByText('Light mode')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('should call logout and redirect on logout click', async () => {
    render(<AppSidebar />)

    await userEvent.click(screen.getByText('Logout'))

    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })
})
