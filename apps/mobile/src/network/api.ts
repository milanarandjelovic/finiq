import { NetworkClient } from '@/network/network-client'
import { URLS } from '@/network/urls'
import {
  type ForgotPasswordPayload,
  type ForgotPasswordResponse,
  type LoginPayload,
  type LoginResponse,
  type RegisterPayload,
  type RegisterResponse,
  type ResetPasswordPayload,
  type ResetPasswordResponse,
} from '@/types/auth'
import {
  type BudgetQuery,
  type BudgetResponse,
  type BudgetsResponse,
  type CopyBudgetPayload,
  type UpsertBudgetPayload,
} from '@/types/budget'
import {
  type CategoriesFindAllQuery,
  type CategoriesResponse,
  type CategoryResponse,
  type CreateCategoryPayload,
  type UpdateCategoryPayload,
} from '@/types/category'
import { type DashboardQuery, type DashboardResponse } from '@/types/dashboard'
import {
  type SettingResponse,
  type UpdateSettingPayload,
} from '@/types/setting'
import {
  type StatisticsQuery,
  type StatisticsResponse,
} from '@/types/statistics'
import {
  type CreateTransactionPayload,
  type TransactionResponse,
  type TransactionsFindAllQuery,
  type TransactionsResponse,
} from '@/types/transaction'
import {
  type ChangePasswordPayload,
  type UpdateProfilePayload,
  type UserProfileResponse,
} from '@/types/user'

export class FiniqAPI {
  // Auth
  static readonly auth = {
    login: (data: LoginPayload) => {
      return NetworkClient.getInstance().post<LoginResponse>(
        URLS.API.AUTH.LOGIN,
        data,
      )
    },
    register: (data: RegisterPayload) => {
      return NetworkClient.getInstance().post<RegisterResponse>(
        URLS.API.AUTH.REGISTER,
        data,
      )
    },
    forgotPassword: (data: ForgotPasswordPayload) => {
      return NetworkClient.getInstance().post<ForgotPasswordResponse>(
        URLS.API.AUTH.FORGOT_PASSWORD,
        data,
      )
    },
    resetPassword: (data: ResetPasswordPayload) => {
      return NetworkClient.getInstance().post<ResetPasswordResponse>(
        URLS.API.AUTH.RESET_PASSWORD,
        data,
      )
    },
    logout: () => {
      return NetworkClient.getInstance().post<void>(URLS.API.AUTH.LOGOUT)
    },
  }

  // Dashboard
  static readonly dashboard = {
    get: (params: DashboardQuery) => {
      return NetworkClient.getInstance().get<DashboardResponse>(
        URLS.API.DASHBOARD.GET,
        { params },
      )
    },
  }

  // Transactions
  static readonly transactions = {
    findAll: (params: TransactionsFindAllQuery) => {
      return NetworkClient.getInstance().get<TransactionsResponse>(
        URLS.API.TRANSACTIONS.FIND_ALL,
        { params },
      )
    },
    create: (data: CreateTransactionPayload) => {
      return NetworkClient.getInstance().post<TransactionResponse>(
        URLS.API.TRANSACTIONS.CREATE,
        data,
      )
    },
    delete: (id: string) => {
      return NetworkClient.getInstance().delete<TransactionResponse>(
        URLS.API.TRANSACTIONS.DELETE(id),
      )
    },
  }

  // Categories
  static readonly categories = {
    findAll: (params?: CategoriesFindAllQuery) => {
      return NetworkClient.getInstance().get<CategoriesResponse>(
        URLS.API.CATEGORIES.FIND_ALL,
        { params },
      )
    },
    create: (data: CreateCategoryPayload) => {
      return NetworkClient.getInstance().post<CategoryResponse>(
        URLS.API.CATEGORIES.CREATE,
        data,
      )
    },
    update: (id: string, data: UpdateCategoryPayload) => {
      return NetworkClient.getInstance().put<CategoryResponse>(
        URLS.API.CATEGORIES.UPDATE(id),
        data,
      )
    },
    delete: (id: string) => {
      return NetworkClient.getInstance().delete<CategoryResponse>(
        URLS.API.CATEGORIES.DELETE(id),
      )
    },
  }

  // Budgets
  static readonly budgets = {
    findAll: (params: BudgetQuery) => {
      return NetworkClient.getInstance().get<BudgetsResponse>(
        URLS.API.BUDGETS.FIND_ALL,
        { params },
      )
    },
    upsert: (data: UpsertBudgetPayload) => {
      return NetworkClient.getInstance().put<BudgetResponse>(
        URLS.API.BUDGETS.UPSERT,
        data,
      )
    },
    copyFromPreviousMonth: (data: CopyBudgetPayload) => {
      return NetworkClient.getInstance().post<BudgetsResponse>(
        URLS.API.BUDGETS.COPY,
        data,
      )
    },
  }

  // Statistics
  static readonly statistics = {
    get: (params: StatisticsQuery) => {
      return NetworkClient.getInstance().get<StatisticsResponse>(
        URLS.API.STATISTICS.GET,
        { params },
      )
    },
  }

  // Settings
  static readonly settings = {
    findAll: () => {
      return NetworkClient.getInstance().get<SettingResponse>(
        URLS.API.SETTINGS.FIND_ALL,
      )
    },
    update: (data: UpdateSettingPayload) => {
      return NetworkClient.getInstance().put<SettingResponse>(
        URLS.API.SETTINGS.UPDATE,
        data,
      )
    },
  }

  // Profile
  static readonly profile = {
    update: (data: UpdateProfilePayload) => {
      return NetworkClient.getInstance().post<UserProfileResponse>(
        URLS.API.PROFILE.UPDATE,
        data,
      )
    },
    changePassword: (data: ChangePasswordPayload) => {
      return NetworkClient.getInstance().post<UserProfileResponse>(
        URLS.API.PASSWORD.CHANGE,
        data,
      )
    },
  }
}
