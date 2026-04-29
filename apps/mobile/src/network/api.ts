import { NetworkClient } from '@/network/network-client'
import { urls } from '@/network/urls'
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
  static readonly auth = {
    login: (data: LoginPayload) => {
      return NetworkClient.getInstance().post<LoginResponse>(
        urls.api.auth.login,
        data,
      )
    },
    register: (data: RegisterPayload) => {
      return NetworkClient.getInstance().post<RegisterResponse>(
        urls.api.auth.register,
        data,
      )
    },
    forgotPassword: (data: ForgotPasswordPayload) => {
      return NetworkClient.getInstance().post<ForgotPasswordResponse>(
        urls.api.auth.forgotPassword,
        data,
      )
    },
    resetPassword: (data: ResetPasswordPayload) => {
      return NetworkClient.getInstance().post<ResetPasswordResponse>(
        urls.api.auth.resetPassword,
        data,
      )
    },
    logout: () => {
      return NetworkClient.getInstance().post<void>(urls.api.auth.logout)
    },
  }

  static readonly dashboard = {
    get: (params: DashboardQuery) => {
      return NetworkClient.getInstance().get<DashboardResponse>(
        urls.api.dashboard.get,
        { params },
      )
    },
  }

  static readonly transactions = {
    findAll: (params: TransactionsFindAllQuery) => {
      return NetworkClient.getInstance().get<TransactionsResponse>(
        urls.api.transactions.findAll,
        { params },
      )
    },
    create: (data: CreateTransactionPayload) => {
      return NetworkClient.getInstance().post<TransactionResponse>(
        urls.api.transactions.create,
        data,
      )
    },
    delete: (id: string) => {
      return NetworkClient.getInstance().delete<TransactionResponse>(
        urls.api.transactions.delete(id),
      )
    },
  }

  static readonly categories = {
    findAll: (params?: CategoriesFindAllQuery) => {
      return NetworkClient.getInstance().get<CategoriesResponse>(
        urls.api.categories.findAll,
        { params },
      )
    },
    create: (data: CreateCategoryPayload) => {
      return NetworkClient.getInstance().post<CategoryResponse>(
        urls.api.categories.create,
        data,
      )
    },
    update: (id: string, data: UpdateCategoryPayload) => {
      return NetworkClient.getInstance().put<CategoryResponse>(
        urls.api.categories.update(id),
        data,
      )
    },
    delete: (id: string) => {
      return NetworkClient.getInstance().delete<CategoryResponse>(
        urls.api.categories.delete(id),
      )
    },
  }

  static readonly budgets = {
    findAll: (params: BudgetQuery) => {
      return NetworkClient.getInstance().get<BudgetsResponse>(
        urls.api.budgets.findAll,
        { params },
      )
    },
    upsert: (data: UpsertBudgetPayload) => {
      return NetworkClient.getInstance().put<BudgetResponse>(
        urls.api.budgets.upsert,
        data,
      )
    },
    copyFromPreviousMonth: (data: CopyBudgetPayload) => {
      return NetworkClient.getInstance().post<BudgetsResponse>(
        urls.api.budgets.copy,
        data,
      )
    },
  }

  static readonly statistics = {
    get: (params: StatisticsQuery) => {
      return NetworkClient.getInstance().get<StatisticsResponse>(
        urls.api.statistics.get,
        { params },
      )
    },
  }

  static readonly settings = {
    findAll: () => {
      return NetworkClient.getInstance().get<SettingResponse>(
        urls.api.settings.findAll,
      )
    },
    update: (data: UpdateSettingPayload) => {
      return NetworkClient.getInstance().put<SettingResponse>(
        urls.api.settings.update,
        data,
      )
    },
  }

  static readonly profile = {
    update: (data: UpdateProfilePayload) => {
      return NetworkClient.getInstance().post<UserProfileResponse>(
        urls.api.profile.update,
        data,
      )
    },
    changePassword: (data: ChangePasswordPayload) => {
      return NetworkClient.getInstance().post<UserProfileResponse>(
        urls.api.password.change,
        data,
      )
    },
  }
}
