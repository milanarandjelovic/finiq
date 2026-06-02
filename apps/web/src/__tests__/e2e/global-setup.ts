import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export const CREDENTIALS_FILE = path.join(
  __dirname,
  '.auth',
  'credentials.json',
)

const E2E_USER = {
  name: 'Test User',
  email: 'info@email.com',
  password: '1Jc1uE@1uKi7rx-=',
}

export default async function globalSetup() {
  try {
    const res = await fetch(`${API_URL}/health`)
    if (!res.ok) throw new Error(`status ${res.status}`)
  } catch {
    throw new Error(
      `API at ${API_URL} is not reachable — start it before running e2e tests.`,
    )
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: E2E_USER.email,
      password: E2E_USER.password,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST /auth/login → ${res.status}: ${text}`)
  }
  const body = (await res.json()) as {
    data?: { accessToken: string; refreshToken: string }
  }
  const accessToken = body.data?.accessToken
  const refreshToken = body.data?.refreshToken
  if (!accessToken || !refreshToken)
    throw new Error('Login response missing tokens')

  fs.mkdirSync(path.dirname(CREDENTIALS_FILE), { recursive: true })
  fs.writeFileSync(
    CREDENTIALS_FILE,
    JSON.stringify({ ...E2E_USER, accessToken, refreshToken }),
  )
}
