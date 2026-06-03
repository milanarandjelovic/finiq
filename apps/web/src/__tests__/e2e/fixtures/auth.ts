import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { test as base, expect, type Page } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export type TestUser = {
  name: string
  email: string
  password: string
  accessToken: string
  refreshToken: string
}

const CREDENTIALS_FILE = path.join(__dirname, '../.auth', 'credentials.json')

function readCredentials(): TestUser {
  const raw = fs.readFileSync(CREDENTIALS_FILE, 'utf-8')
  return JSON.parse(raw) as TestUser
}

export const test = base.extend<{ authedPage: Page }, { testUser: TestUser }>({
  testUser: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, provide) => {
      await provide(readCredentials())
    },
    { scope: 'worker' },
  ],

  authedPage: async ({ page }, provide) => {
    await page.goto('/dashboard')
    await page.waitForSelector('[data-testid="user-menu-trigger"]', {
      timeout: 30_000,
    })
    await provide(page)
  },
})

export { expect }
