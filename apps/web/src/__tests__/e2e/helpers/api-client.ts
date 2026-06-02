import {
  getAuthControllerLoginUrl,
  getAuthControllerRegisterUrl,
  getAuthControllerVerifyEmailUrl,
} from '@/api/__generated__/auth/auth'
import { getBudgetControllerUpsertUrl } from '@/api/__generated__/budgets/budgets'
import {
  getCategoryControllerCreateUrl,
  getCategoryControllerDeleteUrl,
} from '@/api/__generated__/categories/categories'
import type {
  AuthControllerLogin200,
  Category,
  CategoryControllerCreate201,
  CreateCategoryPayloadDto,
  CreateTransactionPayloadDto,
  RegisterPayloadDto,
  Transaction,
  TransactionControllerCreate201,
  UpsertBudgetPayloadDto,
} from '@/api/__generated__/models'
import {
  getTransactionControllerCreateUrl,
  getTransactionControllerDeleteUrl,
} from '@/api/__generated__/transactions/transactions'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

async function apiCall<T>(
  url: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(
      `${options.method ?? 'GET'} ${url} → ${res.status}: ${body}`,
    )
  }
  return res.json() as Promise<T>
}

export async function registerUser(
  payload: Pick<RegisterPayloadDto, 'name' | 'email' | 'password'>,
): Promise<void> {
  await apiCall(getAuthControllerRegisterUrl(), {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      passwordConfirmation: payload.password,
    }),
  })
}

export async function verifyEmail(
  token: string,
  password: string,
): Promise<void> {
  await apiCall(getAuthControllerVerifyEmailUrl(), {
    method: 'POST',
    body: JSON.stringify({ token, password, passwordConfirmation: password }),
  })
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await apiCall<AuthControllerLogin200>(
    getAuthControllerLoginUrl(),
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  )
  const accessToken = res.data?.accessToken
  const refreshToken = res.data?.refreshToken
  if (!accessToken) throw new Error('Login response missing accessToken')
  if (!refreshToken) throw new Error('Login response missing refreshToken')
  return { accessToken, refreshToken }
}

export async function createCategory(
  token: string,
  payload: CreateCategoryPayloadDto,
): Promise<Category> {
  const res = await apiCall<CategoryControllerCreate201>(
    getCategoryControllerCreateUrl(),
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  )
  const category = res.data?.category
  if (!category) throw new Error('Create category response missing category')
  return category
}

export async function deleteCategory(token: string, id: string): Promise<void> {
  await apiCall(getCategoryControllerDeleteUrl(id), { method: 'DELETE' }, token)
}

export async function createTransaction(
  token: string,
  payload: CreateTransactionPayloadDto,
): Promise<Transaction> {
  const res = await apiCall<TransactionControllerCreate201>(
    getTransactionControllerCreateUrl(),
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  )
  const transaction = res.data?.transaction
  if (!transaction)
    throw new Error('Create transaction response missing transaction')
  return transaction
}

export async function deleteTransaction(
  token: string,
  id: string,
): Promise<void> {
  await apiCall(
    getTransactionControllerDeleteUrl(id),
    { method: 'DELETE' },
    token,
  )
}

export async function upsertBudget(
  token: string,
  payload: UpsertBudgetPayloadDto,
): Promise<void> {
  await apiCall(
    getBudgetControllerUpsertUrl(),
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  )
}
