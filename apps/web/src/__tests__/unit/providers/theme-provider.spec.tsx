import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { ThemeProvider } from '@/providers/theme-provider'

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children, ...props }: any) => (
    <div data-props={JSON.stringify(props)} data-testid="next-themes-provider">
      {children}
    </div>
  ),
}))

describe('ThemeProvider', () => {
  it('should render children', () => {
    render(
      <ThemeProvider>
        <span data-testid="child">content</span>
      </ThemeProvider>,
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('should pass props to NextThemesProvider', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <span>content</span>
      </ThemeProvider>,
    )

    const provider = screen.getByTestId('next-themes-provider')
    const props = JSON.parse(provider.getAttribute('data-props')!)

    expect(props.attribute).toBe('class')
    expect(props.defaultTheme).toBe('dark')
  })

  it('should render without attribute prop', () => {
    render(
      <ThemeProvider>
        <span>content</span>
      </ThemeProvider>,
    )

    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument()
  })
})
