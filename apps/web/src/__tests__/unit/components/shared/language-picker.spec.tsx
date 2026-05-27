import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { LanguagePicker } from '@/components/shared/language-picker'

vi.mock('@/util/env', () => ({
  Env: { apiUrl: 'http://localhost:3000', i18nUrl: 'http://localhost:3001' },
  ClientEnv: {
    apiUrl: 'http://localhost:3000',
    i18nUrl: 'http://localhost:3001',
  },
}))

vi.mock('@/i18n', () => ({
  changeLanguage: vi.fn(),
}))

vi.mock(
  'react-i18next',
  async () => import('@/__tests__/unit/__mocks__/react-i18next'),
)

vi.mock('@/hooks/data/use-available-languages', () => ({
  useAvailableLanguages: () => ({
    data: ['en', 'sr'],
    isLoading: false,
  }),
}))

vi.mock(
  '@finiq/ui/components/button',
  async () => import('@/__tests__/unit/__mocks__/button'),
)

vi.mock('@finiq/ui/components/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: () => null,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
}))

vi.mock(
  'lucide-react',
  async () => import('@/__tests__/unit/__mocks__/lucide-react'),
)

describe('LanguagePicker', () => {
  it('should render the current language name', () => {
    render(<LanguagePicker />)

    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('should render a dropdown trigger button', () => {
    render(<LanguagePicker />)

    expect(screen.getByText('English').closest('button')).toBeInTheDocument()
  })

  it('should render the chevron icon', () => {
    render(<LanguagePicker />)

    expect(screen.getByText('ChevronDownIcon')).toBeInTheDocument()
  })
})
