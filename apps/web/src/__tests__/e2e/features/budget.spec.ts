import { expect, test } from '@/__tests__/e2e/fixtures/auth'
import {
  createCategory,
  deleteCategory,
  upsertBudget,
} from '@/__tests__/e2e/helpers/api-client'
import type { Category } from '@/api/__generated__/models'

let seededCategory: Category

test.describe('Budget management', () => {
  test.beforeEach(async ({ testUser }) => {
    const now = new Date()
    seededCategory = await createCategory(testUser.accessToken, {
      name: 'E2E Budget Category',
      emoji: '💰',
      color: '#10b981',
    })
    await upsertBudget(testUser.accessToken, {
      categoryId: seededCategory.id,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      amount: 100,
    })
  })

  test.afterEach(async ({ testUser }) => {
    if (seededCategory?.id) {
      await deleteCategory(testUser.accessToken, seededCategory.id).catch(
        () => undefined,
      )
    }
  })

  test('should render the budget page', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/budget')

    await expect(authedPage.getByText(/budget/i).first()).toBeVisible()
  })

  test('should display the budget table', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/budget')

    await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
      timeout: 10_000,
    })
  })

  test('should show ready to assign amount', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/budget')

    await expect(authedPage.getByText(/ready to assign/i)).toBeVisible({
      timeout: 10_000,
    })
  })

  test('should assign a budget amount to a category', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/budget')

    await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
      timeout: 10_000,
    })

    await authedPage.getByTestId('budget-row-actions').first().click()
    await authedPage.getByTestId('budget-assign-action').click()

    const amountInput = authedPage.getByLabel(/^amount$/i)
    await expect(amountInput).toBeVisible({ timeout: 5_000 })

    await authedPage
      .getByRole('button', { name: /save changes|assign/i })
      .click()

    await expect(amountInput).not.toBeVisible({ timeout: 5_000 })
  })

  test('should validate the budget assign amount', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/budget')

    await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
      timeout: 10_000,
    })

    await authedPage.getByTestId('budget-row-actions').first().click()
    await authedPage.getByTestId('budget-assign-action').click()

    const amountInput = authedPage.getByLabel(/^amount$/i)
    await expect(amountInput).toBeVisible({ timeout: 5_000 })

    await amountInput.clear()
    await authedPage
      .getByRole('button', { name: /save changes|assign/i })
      .click()

    await expect(amountInput).toBeVisible({ timeout: 2_000 })
  })

  test('should navigate month with the month picker', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/budget')

    await expect(
      authedPage.getByRole('button', {
        name: /january|february|march|april|may|june|july|august|september|october|november|december/i,
      }),
    ).toBeVisible({ timeout: 10_000 })
  })
})
