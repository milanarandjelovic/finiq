import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Providers } from '@/providers/providers'

const mockDetectLang = vi.fn().mockResolvedValue('en')
const mockChangeLang = vi.fn().mockResolvedValue(undefined)

vi.mock('@/i18n', () => ({
  default: {},
  detectUserLanguage: () => mockDetectLang(),
  changeLanguage: (lang: string) => mockChangeLang(lang),
}))

vi.mock('@/context/auth-context', () => ({
  AuthProvider: ({ children }: any) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}))

vi.mock('react-i18next', () => ({
  I18nextProvider: ({ children }: any) => (
    <div data-testid="i18n-provider">{children}</div>
  ),
}))

vi.mock('@finiq/ui/components/sonner', () => ({
  Toaster: () => <div data-testid="toaster" />,
}))

vi.mock('@finiq/ui/components/tooltip', () => ({
  TooltipProvider: ({ children }: any) => (
    <div data-testid="tooltip-provider">{children}</div>
  ),
}))

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: any) => (
    <div data-testid="query-provider">{children}</div>
  ),
}))

describe('Providers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children', () => {
    render(
      <Providers>
        <span data-testid="child">hello</span>
      </Providers>,
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('should detect language on mount', async () => {
    render(
      <Providers>
        <span>child</span>
      </Providers>,
    )

    await vi.waitFor(() => {
      expect(mockDetectLang).toHaveBeenCalledTimes(1)
      expect(mockChangeLang).toHaveBeenCalledWith('en')
    })
  })

  it('should render all providers in the correct order', () => {
    render(
      <Providers>
        <span>child</span>
      </Providers>,
    )

    const query = screen.getByTestId('query-provider')
    const i18n = screen.getByTestId('i18n-provider')
    const tooltip = screen.getByTestId('tooltip-provider')
    const auth = screen.getByTestId('auth-provider')
    const toaster = screen.getByTestId('toaster')

    expect(query).toBeInTheDocument()
    expect(i18n).toBeInTheDocument()
    expect(tooltip).toBeInTheDocument()
    expect(auth).toBeInTheDocument()
    expect(toaster).toBeInTheDocument()
  })
})
