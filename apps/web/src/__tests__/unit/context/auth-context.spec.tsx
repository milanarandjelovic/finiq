import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { AuthProvider, useAuth } from '@/context/auth-context'
import {
  clearAccessToken,
  clearRefreshToken,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/cookies'

vi.mock('@/lib/cookies', () => ({
  getAccessToken: vi.fn(),
  setAccessToken: vi.fn(),
  setRefreshToken: vi.fn(),
  clearAccessToken: vi.fn(),
  clearRefreshToken: vi.fn(),
}))

function TestConsumer() {
  const auth = useAuth()
  return (
    <div>
      <span data-testid="is-auth">{String(auth.isAuthenticated)}</span>
      <span data-testid="is-loading">{String(auth.isLoading)}</span>
      <button onClick={() => auth.login('at', 'rt')}>Login</button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show authenticated when token exists on mount', () => {
    vi.mocked(getAccessToken).mockReturnValue('existing-token')

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('is-auth')).toHaveTextContent('true')
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
  })

  it('should show not authenticated when no token', () => {
    vi.mocked(getAccessToken).mockReturnValue(null)

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('is-auth')).toHaveTextContent('false')
  })

  it('should login and set tokens', async () => {
    vi.mocked(getAccessToken).mockReturnValue(null)

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await userEvent.click(screen.getByText('Login'))

    expect(setAccessToken).toHaveBeenCalledWith('at')
    expect(setRefreshToken).toHaveBeenCalledWith('rt')
    expect(screen.getByTestId('is-auth')).toHaveTextContent('true')
  })

  it('should logout and clear tokens', async () => {
    vi.mocked(getAccessToken).mockReturnValue('existing-token')

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await userEvent.click(screen.getByText('Logout'))

    expect(clearAccessToken).toHaveBeenCalled()
    expect(clearRefreshToken).toHaveBeenCalled()
    expect(screen.getByTestId('is-auth')).toHaveTextContent('false')
  })
})

describe('useAuth', () => {
  it('should throw without AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used inside AuthProvider',
    )

    consoleError.mockRestore()
  })
})
