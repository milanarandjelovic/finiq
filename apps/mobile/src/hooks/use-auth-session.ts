import { FiniqAPI } from '@/network/api'
import { useAuth } from '@/providers/auth-provider'
import { type LoginPayload } from '@/types/auth'

export const useAuthSession = () => {
  const { loginHandler, logoutHandler } = useAuth()

  const login = async (credentials: LoginPayload): Promise<void> => {
    const res = await FiniqAPI.auth.login(credentials)
    await loginHandler(res.data.data)
  }

  const logout = async (): Promise<void> => {
    try {
      await FiniqAPI.auth.logout()
    } finally {
      await logoutHandler()
    }
  }

  return { login, logout }
}
