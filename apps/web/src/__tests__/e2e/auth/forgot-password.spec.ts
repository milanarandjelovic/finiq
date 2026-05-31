import { expect, test } from '@playwright/test'

import { generateTestUser } from '../helpers/test-data'

test.describe('Forgot password page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password')
  })

  test('should render the forgot password form', async ({ page }) => {
    await expect(page.getByText('Forgot password?')).toBeVisible()

    await expect(page.getByTestId('forgot-password-email')).toBeVisible()
    await expect(page.getByTestId('forgot-password-submit')).toBeVisible()
    await expect(page.getByTestId('forgot-password-back')).toBeVisible()
  })

  test('should show validation for invalid email', async ({ page }) => {
    await page.getByTestId('forgot-password-email').fill('')
    await page.getByTestId('forgot-password-submit').click()

    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('should show success state after submitting valid email', async ({
    page,
  }) => {
    const user = generateTestUser()
    await page.goto('/auth/register')
    await page.getByTestId('register-name').fill(user.name)
    await page.getByTestId('register-email').fill(user.email)
    await page.getByTestId('register-password').fill(user.password)
    await page.getByTestId('register-confirm-password').fill(user.password)
    await page.getByTestId('register-submit').click()
    await page.waitForURL('/auth/login')

    await page.goto('/auth/forgot-password')
    await page.getByTestId('forgot-password-email').fill(user.email)
    await page.getByTestId('forgot-password-submit').click()

    await expect(page.getByText(/check your email/i)).toBeVisible()
    await expect(page.getByText(user.email)).toBeVisible()
  })

  test('should allow navigating back to sign in', async ({ page }) => {
    await page.getByTestId('forgot-password-back').click()

    await expect(page).toHaveURL('/auth/login')
  })
})
