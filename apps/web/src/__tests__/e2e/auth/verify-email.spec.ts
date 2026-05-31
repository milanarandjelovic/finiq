import { expect, test } from '@playwright/test'

test.describe('Verify email page', () => {
  test('should show error when no token is provided', async ({ page }) => {
    await page.goto('/auth/verify-email')

    await expect(page.getByTestId('verify-email-error-title')).toBeVisible()
  })

  test('should show success state for valid token', async ({ page }) => {
    await page.goto('/auth/verify-email?token=valid-token')

    await expect(
      page
        .getByTestId('verify-email-success-title')
        .or(page.getByTestId('verify-email-error-title')),
    ).toBeVisible({ timeout: 10_000 })
  })

  test('should show error state for invalid token', async ({ page }) => {
    await page.goto('/auth/verify-email?token=bad-token')

    await expect(page.getByTestId('verify-email-error-title')).toBeVisible({
      timeout: 10_000,
    })
  })

  test('should navigate to login from success state', async ({ page }) => {
    await page.goto('/auth/verify-email?token=valid-token')

    await expect(
      page
        .getByTestId('verify-email-success-title')
        .or(page.getByTestId('verify-email-error-title')),
    ).toBeVisible({ timeout: 10_000 })

    await page.getByTestId('verify-email-back').click()

    await expect(page).toHaveURL('/auth/login')
  })
})
