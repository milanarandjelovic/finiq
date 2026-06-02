import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { getEmailVerificationToken } from './helpers/db-client'
import { generateTestUser } from './helpers/test-data'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
export const CREDENTIALS_FILE = path.join(
  __dirname,
  '.auth',
  'credentials.json',
)

async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST ${endpoint} → ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
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

  const user = generateTestUser()

  await post('/auth/register', {
    name: user.name,
    email: user.email,
    password: user.password,
    passwordConfirmation: user.password,
  })

  const verificationToken = await getEmailVerificationToken(user.email)

  await post('/auth/verify-email', {
    token: verificationToken,
    password: user.password,
    passwordConfirmation: user.password,
  })

  const loginRes = await post<{
    data?: { accessToken: string; refreshToken: string }
  }>('/auth/login', { email: user.email, password: user.password })

  const accessToken = loginRes.data?.accessToken
  const refreshToken = loginRes.data?.refreshToken
  if (!accessToken || !refreshToken) {
    throw new Error('Login response missing tokens')
  }

  fs.mkdirSync(path.dirname(CREDENTIALS_FILE), { recursive: true })
  fs.writeFileSync(
    CREDENTIALS_FILE,
    JSON.stringify({ ...user, accessToken, refreshToken }),
  )
}
