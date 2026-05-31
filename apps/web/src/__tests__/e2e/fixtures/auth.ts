import { test as base, expect, type Page } from '@playwright/test'

import { generateTestUser } from '@/__tests__/e2e/helpers/test-data'

const MOCK_USER = { id: 1, name: 'Test User', email: 'e2e@finiq.test' }

export const test = base.extend<{
  authedPage: Page
  testUser: ReturnType<typeof generateTestUser>
}>({
  // eslint-disable-next-line no-empty-pattern
  testUser: async ({}, provide) => {
    const user = generateTestUser()
    await provide(user)
  },

  authedPage: async ({ page }, provide) => {
    await page.route(/localhost:4000/, async (route) => {
      const url = route.request().url()
      const method = route.request().method()

      if (url.includes('/auth/login') && method === 'POST') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'User logged in successfully.',
            data: {
              accessToken: 'e2e-test-access-token',
              refreshToken: 'e2e-test-refresh-token',
              user: MOCK_USER,
            },
          }),
        })
      }

      if (url.includes('/user/profile')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Profile found.',
            data: { user: MOCK_USER },
          }),
        })
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'OK', data: {} }),
      })
    })

    await page.goto('/auth/login')
    await page.getByTestId('login-email').fill(MOCK_USER.email)
    await page.getByTestId('login-password').fill('Password123!')
    await page.getByTestId('login-submit').click()
    await page.waitForURL('/dashboard')

    await provide(page)
  },
})

export { expect }
