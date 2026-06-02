import { expect, test } from '@/__tests__/e2e/fixtures/auth'
import {
  createCategory,
  deleteCategory,
} from '@/__tests__/e2e/helpers/api-client'
import { generateTestGoal } from '@/__tests__/e2e/helpers/test-data'
import type { Category } from '@/api/__generated__/models'

let seededGoal: Category

test.describe('Goals CRUD', () => {
  test('should render the goals page', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/goals')

    await expect(authedPage.getByText(/goals/i).first()).toBeVisible()
    await expect(authedPage.getByTestId('add-goal-btn')).toBeVisible()
  })

  test('should create a new goal', async ({ authedPage }) => {
    const goal = generateTestGoal()
    await authedPage.goto('/dashboard/goals')
    await authedPage.getByTestId('add-goal-btn').click()
    await authedPage.getByLabel(/goal name/i).fill(goal.name)
    await authedPage.getByLabel(/target amount/i).clear()
    await authedPage
      .getByLabel(/target amount/i)
      .fill(String(goal.targetAmount))
    await authedPage.getByLabel(/monthly contribution/i).clear()
    await authedPage.getByLabel(/monthly contribution/i).fill('0')
    await authedPage.getByRole('button', { name: /save goal/i }).click()

    await expect(authedPage.getByText('Goal created')).toBeVisible({
      timeout: 10_000,
    })
  })

  test('should show validation errors in the goal form', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/goals')
    await authedPage.getByTestId('add-goal-btn').click()
    await authedPage.getByRole('button', { name: /save goal/i }).click()

    await expect(
      authedPage.getByText('Name should not be empty.'),
    ).toBeVisible()
  })

  test.describe('with seeded goal', () => {
    test.beforeEach(async ({ testUser }) => {
      const goal = generateTestGoal()
      seededGoal = await createCategory(testUser.accessToken, {
        name: goal.name,
        emoji: goal.emoji,
        color: goal.color,
        isGoal: true,
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate,
        budgetAmount: 0,
      })
    })

    test.afterEach(async ({ testUser }) => {
      if (seededGoal?.id) {
        await deleteCategory(testUser.accessToken, seededGoal.id).catch(
          () => undefined,
        )
      }
    })

    test('should edit an existing goal', async ({ authedPage }) => {
      await authedPage.goto('/dashboard/goals')

      await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
        timeout: 10_000,
      })

      await authedPage.getByTestId('category-row-actions').first().click()
      await authedPage.getByTestId('category-edit-action').click()
      await authedPage.getByLabel(/goal name/i).clear()
      await authedPage.getByLabel(/goal name/i).fill('Updated Goal Name')
      await authedPage.getByLabel(/target amount/i).clear()
      await authedPage.getByLabel(/target amount/i).fill('5000')
      await authedPage.getByLabel(/monthly contribution/i).clear()
      await authedPage.getByLabel(/monthly contribution/i).fill('0')
      await authedPage.getByRole('button', { name: /save goal/i }).click()

      await expect(authedPage.getByText('Goal updated')).toBeVisible({
        timeout: 10_000,
      })
    })

    test('should delete a goal with confirmation', async ({ authedPage }) => {
      await authedPage.goto('/dashboard/goals')

      await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
        timeout: 10_000,
      })

      await authedPage.getByTestId('category-row-actions').first().click()
      await authedPage.getByTestId('category-delete-action').click()
      await authedPage.getByRole('button', { name: /^delete$/i }).click()

      await expect(authedPage.getByText('Goal deleted')).toBeVisible({
        timeout: 10_000,
      })
      seededGoal = null as unknown as Category
    })
  })
})
