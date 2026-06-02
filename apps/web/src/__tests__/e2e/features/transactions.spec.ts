import { expect, test } from '@/__tests__/e2e/fixtures/auth'
import {
  createCategory,
  createTransaction,
  deleteCategory,
  deleteTransaction,
} from '@/__tests__/e2e/helpers/api-client'
import { generateTestTransaction } from '@/__tests__/e2e/helpers/test-data'
import type { Category, Transaction } from '@/api/__generated__/models'

let seededCategory: Category
let seededTransaction: Transaction

test.describe('Transactions CRUD', () => {
  test('should render the transactions page', async ({ authedPage }) => {
    await authedPage.goto('/dashboard/transactions')

    await expect(authedPage.getByText(/transactions/i).first()).toBeVisible()
    await expect(
      authedPage.getByRole('button', { name: /add transaction/i }),
    ).toBeVisible()
  })

  test('should show validation errors in the transaction form', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/transactions')
    await authedPage.getByRole('button', { name: /add transaction/i }).click()

    const amountInput = authedPage.getByLabel(/^amount$/i)
    await amountInput.clear()
    await amountInput.fill('0')

    await authedPage.getByTestId('transaction-form-submit').click()

    await expect(
      authedPage.getByText('Amount must be greater than 0.'),
    ).toBeVisible()
  })

  test('should cancel transaction creation when closing the dialog', async ({
    authedPage,
  }) => {
    await authedPage.goto('/dashboard/transactions')
    await authedPage.getByRole('button', { name: /add transaction/i }).click()
    await authedPage.getByLabel(/^amount$/i).fill('99')
    await authedPage.keyboard.press('Escape')

    await expect(
      authedPage.getByTestId('transaction-form-submit'),
    ).not.toBeVisible()
  })

  test.describe('with seeded data', () => {
    test.beforeEach(async ({ testUser }) => {
      seededCategory = await createCategory(testUser.accessToken, {
        name: 'E2E Category',
        emoji: '🛒',
        color: '#6366f1',
        budgetAmount: 0,
      })
      const txn = generateTestTransaction()
      seededTransaction = await createTransaction(testUser.accessToken, {
        type: txn.type,
        amount: txn.amount,
        date: txn.date,
        note: txn.note,
        categoryId: seededCategory.id,
      })
    })

    test.afterEach(async ({ testUser }) => {
      if (seededTransaction?.id) {
        await deleteTransaction(
          testUser.accessToken,
          seededTransaction.id,
        ).catch(() => undefined)
      }
      if (seededCategory?.id) {
        await deleteCategory(testUser.accessToken, seededCategory.id).catch(
          () => undefined,
        )
      }
    })

    test('should create a new expense transaction', async ({
      authedPage,
      testUser: _testUser,
    }) => {
      const txn = generateTestTransaction()
      await authedPage.goto('/dashboard/transactions')
      await authedPage.getByRole('button', { name: /add transaction/i }).click()
      await authedPage.getByLabel(/^amount$/i).fill(String(txn.amount))
      await authedPage.getByLabel(/note/i).fill(txn.note)

      // Select the seeded category for this expense
      const categorySelect = authedPage
        .getByRole('combobox')
        .filter({ hasText: /category/i })
      if (await categorySelect.isVisible()) {
        await categorySelect.click()
        await authedPage.getByRole('option', { name: /E2E Category/i }).click()
      }

      await authedPage.getByTestId('transaction-form-submit').click()

      await expect(authedPage.getByText('Transaction added')).toBeVisible({
        timeout: 10_000,
      })
    })

    test('should display transactions in the table', async ({ authedPage }) => {
      await authedPage.goto('/dashboard/transactions')

      await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
        timeout: 10_000,
      })
    })

    test('should delete a transaction with confirmation', async ({
      authedPage,
    }) => {
      await authedPage.goto('/dashboard/transactions')

      await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
        timeout: 10_000,
      })

      await authedPage.getByTestId('transaction-row-actions').first().click()
      await authedPage.getByTestId('transaction-delete-action').click()
      await authedPage.getByRole('button', { name: /^delete$/i }).click()

      await expect(authedPage.getByText('Transaction deleted')).toBeVisible({
        timeout: 10_000,
      })
      seededTransaction = null as unknown as Transaction
    })

    test('should bulk delete selected transactions', async ({ authedPage }) => {
      await authedPage.goto('/dashboard/transactions')

      await expect(authedPage.locator('table tbody tr').first()).toBeVisible({
        timeout: 10_000,
      })

      await authedPage.getByRole('checkbox', { name: 'Select all' }).click()
      await authedPage.getByRole('button', { name: /delete \(/i }).click()
      await authedPage.getByRole('button', { name: /^delete$/i }).click()

      await expect(
        authedPage.getByText(/transaction deleted|transactions deleted/i),
      ).toBeVisible({ timeout: 10_000 })
      seededTransaction = null as unknown as Transaction
    })
  })
})
