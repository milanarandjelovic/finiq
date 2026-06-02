import { expect, test } from '@/__tests__/e2e/fixtures/auth'
import {
  createCategory,
  deleteCategory,
} from '@/__tests__/e2e/helpers/api-client'
import type { Category } from '@/api/__generated__/models'

let seededCategory: Category

test.describe('Categories CRUD', () => {
  test('should render the categories page with add button', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/categories')

    await expect(authedPage.getByText(/categories/i).first()).toBeVisible()
    await expect(authedPage.getByTestId('add-category-btn')).toBeVisible()
  })

  test('should create a new category', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/categories')
    await authedPage.getByTestId('add-category-btn').click()
    await authedPage.getByLabel(/^name$/i).fill('New Test Category')
    await authedPage.getByLabel(/monthly budget/i).clear()
    await authedPage.getByLabel(/monthly budget/i).fill('0')
    await authedPage.getByRole('button', { name: /save category/i }).click()

    await expect(authedPage.getByText('Category created')).toBeVisible({
      timeout: 10_000,
    })
  })

  test.describe('with seeded category', () => {
    test.beforeEach(async ({ testUser }) => {
      seededCategory = await createCategory(testUser.accessToken, {
        name: 'Seed Category',
        emoji: '🛒',
        color: '#6366f1',
        budgetAmount: 0,
      })
    })

    test.afterEach(async ({ testUser }) => {
      if (seededCategory?.id) {
        await deleteCategory(testUser.accessToken, seededCategory.id).catch(
          () => undefined,
        )
      }
    })

    test('should edit an existing category', async ({ authedPage }) => {
      await authedPage.goto('/dashboard/categories')

      await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
        timeout: 10_000,
      })

      await authedPage.getByTestId('category-row-actions').first().click()
      await authedPage.getByTestId('category-edit-action').click()
      await authedPage.getByLabel(/^name$/i).clear()
      await authedPage.getByLabel(/^name$/i).fill('Updated Category Name')
      await authedPage.getByLabel(/monthly budget/i).clear()
      await authedPage.getByLabel(/monthly budget/i).fill('0')
      await authedPage.getByRole('button', { name: /save category/i }).click()

      await expect(authedPage.getByText('Category updated')).toBeVisible({
        timeout: 10_000,
      })
    })

    test('should delete a category with confirmation', async ({
      authedPage,
    }) => {
      await authedPage.goto('/dashboard/categories')

      await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
        timeout: 10_000,
      })

      await authedPage.getByTestId('category-row-actions').first().click()
      await authedPage.getByTestId('category-delete-action').click()
      await authedPage.getByRole('button', { name: /^delete$/i }).click()

      await expect(authedPage.getByText('Category deleted')).toBeVisible({
        timeout: 10_000,
      })
      seededCategory = null as unknown as Category
    })

    test('should bulk delete selected categories', async ({ authedPage }) => {
      await authedPage.goto('/dashboard/categories')

      await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
        timeout: 10_000,
      })

      await authedPage.getByRole('checkbox', { name: 'Select all' }).click()
      await authedPage.getByRole('button', { name: /delete \(/i }).click()
      await authedPage.getByRole('button', { name: /^delete$/i }).click()

      await expect(
        authedPage.getByText(/category deleted|categories deleted/i),
      ).toBeVisible({ timeout: 10_000 })
      seededCategory = null as unknown as Category
    })

    test('should display categories in the table', async ({ authedPage }) => {
      await authedPage.goto('/dashboard/categories')

      await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
        timeout: 10_000,
      })
    })

    test('should filter categories by name search', async ({ authedPage }) => {
      await authedPage.goto('/dashboard/categories')

      await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
        timeout: 10_000,
      })

      const searchInput = authedPage.getByPlaceholder(/filter by name/i)

      if (await searchInput.isVisible()) {
        await searchInput.fill('nonexistent-xyz')

        await expect(authedPage.getByText('No results.')).toBeVisible({
          timeout: 5_000,
        })
      }
    })
  })

  test('should show validation errors in the category form', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/categories')
    await authedPage.getByTestId('add-category-btn').click()
    await authedPage.getByRole('button', { name: /save category/i }).click()

    await expect(
      authedPage.getByText('Name should not be empty.'),
    ).toBeVisible()
  })

  test('should cancel category creation when closing the dialog', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/categories')
    await authedPage.getByTestId('add-category-btn').click()
    await authedPage.getByLabel(/^name$/i).fill('Cancelled Category')
    await authedPage.keyboard.press('Escape')

    await expect(authedPage.getByText('Cancelled Category')).not.toBeVisible()
  })
})
