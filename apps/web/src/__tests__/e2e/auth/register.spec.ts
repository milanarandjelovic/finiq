import { expect, test } from '@playwright/test'

import { generateTestUser } from '../helpers/test-data'

test.describe('Register page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register')
  })

  test('should render the register page with all elements', async ({
    page,
  }) => {
    await expect(page.locator('[data-slot="card-title"]')).toBeVisible()
    await expect(page.getByTestId('register-name')).toBeVisible()
    await expect(page.getByTestId('register-email')).toBeVisible()
    await expect(page.getByTestId('register-password')).toBeVisible()
    await expect(page.getByTestId('register-confirm-password')).toBeVisible()
    await expect(page.getByTestId('register-submit')).toBeVisible()
    await expect(page.getByTestId('register-sign-in')).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByTestId('register-submit').click()

    await expect(
      page.getByText(/should not be empty/i).or(page.getByText(/least 3/i)),
    ).toBeVisible()
  })

  test('should show error when passwords do not match', async ({ page }) => {
    const user = generateTestUser()
    await page.getByTestId('register-name').fill(user.name)
    await page.getByTestId('register-email').fill(user.email)
    await page.getByTestId('register-password').fill(user.password)
    await page
      .getByTestId('register-confirm-password')
      .fill('DifferentPassword1')
    await page.getByTestId('register-submit').click()

    await expect(page.getByText(/must match/i)).toBeVisible()
  })

  test('should register successfully and redirect to login', async ({
    page,
  }) => {
    const user = generateTestUser()

    await page.getByTestId('register-name').fill(user.name)
    await page.getByTestId('register-email').fill(user.email)
    await page.getByTestId('register-password').fill(user.password)
    await page.getByTestId('register-confirm-password').fill(user.password)
    await page.getByTestId('register-submit').click()

    await page.waitForURL('/auth/login')
  })

  test('should navigate to login page via sign in link', async ({ page }) => {
    await expect(page.getByTestId('register-submit')).toBeVisible()
    await page.getByTestId('register-sign-in').click()

    await page.waitForURL('/auth/login')
  })
})
