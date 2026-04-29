import { useMutation, useQuery } from '@tanstack/react-query'
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'

import { axiosInstance } from '../../axios-instance'
import type {
  BudgetControllerCopyFromPreviousMonth200,
  BudgetControllerFindAll200,
  BudgetControllerFindAllParams,
  BudgetControllerUpsert200,
  CopyBudgetPayloadDto,
  UnauthorizedDto,
  UpsertBudgetPayloadDto,
} from '../models'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * @summary Get all budgets for a given month/year
 */
export type budgetControllerFindAllResponse200 = {
  data: BudgetControllerFindAll200
  status: 200
}

export type budgetControllerFindAllResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type budgetControllerFindAllResponseSuccess =
  budgetControllerFindAllResponse200 & {
    headers: Headers
  }
export type budgetControllerFindAllResponseError =
  budgetControllerFindAllResponse401 & {
    headers: Headers
  }

export type budgetControllerFindAllResponse =
  | budgetControllerFindAllResponseSuccess
  | budgetControllerFindAllResponseError

export const getBudgetControllerFindAllUrl = (
  params: BudgetControllerFindAllParams,
) => {
  const normalizedParams = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  })

  const stringifiedParams = normalizedParams.toString()

  return stringifiedParams.length > 0
    ? `/budgets?${stringifiedParams}`
    : `/budgets`
}

export const budgetControllerFindAll = async (
  params: BudgetControllerFindAllParams,
  options?: RequestInit,
): Promise<budgetControllerFindAllResponse> => {
  return axiosInstance<budgetControllerFindAllResponse>(
    getBudgetControllerFindAllUrl(params),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getBudgetControllerFindAllQueryKey = (
  params?: BudgetControllerFindAllParams,
) => {
  return [`/budgets`, ...(params ? [params] : [])] as const
}

export const getBudgetControllerFindAllQueryOptions = <
  TData = Awaited<ReturnType<typeof budgetControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params: BudgetControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof budgetControllerFindAll>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof axiosInstance>
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getBudgetControllerFindAllQueryKey(params)

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof budgetControllerFindAll>>
  > = ({ signal }) =>
    budgetControllerFindAll(params, { signal, ...requestOptions })

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof budgetControllerFindAll>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type BudgetControllerFindAllQueryResult = NonNullable<
  Awaited<ReturnType<typeof budgetControllerFindAll>>
>
export type BudgetControllerFindAllQueryError = UnauthorizedDto

export function useBudgetControllerFindAll<
  TData = Awaited<ReturnType<typeof budgetControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params: BudgetControllerFindAllParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof budgetControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof budgetControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof budgetControllerFindAll>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useBudgetControllerFindAll<
  TData = Awaited<ReturnType<typeof budgetControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params: BudgetControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof budgetControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof budgetControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof budgetControllerFindAll>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useBudgetControllerFindAll<
  TData = Awaited<ReturnType<typeof budgetControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params: BudgetControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof budgetControllerFindAll>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
/**
 * @summary Get all budgets for a given month/year
 */

export function useBudgetControllerFindAll<
  TData = Awaited<ReturnType<typeof budgetControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params: BudgetControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof budgetControllerFindAll>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
} {
  const queryOptions = getBudgetControllerFindAllQueryOptions(params, options)

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}

/**
 * @summary Create or update a budget for a category/month/year
 */
export type budgetControllerUpsertResponse200 = {
  data: BudgetControllerUpsert200
  status: 200
}

export type budgetControllerUpsertResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type budgetControllerUpsertResponseSuccess =
  budgetControllerUpsertResponse200 & {
    headers: Headers
  }
export type budgetControllerUpsertResponseError =
  budgetControllerUpsertResponse401 & {
    headers: Headers
  }

export type budgetControllerUpsertResponse =
  | budgetControllerUpsertResponseSuccess
  | budgetControllerUpsertResponseError

export const getBudgetControllerUpsertUrl = () => {
  return `/budgets`
}

export const budgetControllerUpsert = async (
  upsertBudgetPayloadDto: UpsertBudgetPayloadDto,
  options?: RequestInit,
): Promise<budgetControllerUpsertResponse> => {
  return axiosInstance<budgetControllerUpsertResponse>(
    getBudgetControllerUpsertUrl(),
    {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(upsertBudgetPayloadDto),
    },
  )
}

export const getBudgetControllerUpsertMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof budgetControllerUpsert>>,
    TError,
    { data: UpsertBudgetPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof budgetControllerUpsert>>,
  TError,
  { data: UpsertBudgetPayloadDto },
  TContext
> => {
  const mutationKey = ['budgetControllerUpsert']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof budgetControllerUpsert>>,
    { data: UpsertBudgetPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return budgetControllerUpsert(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type BudgetControllerUpsertMutationResult = NonNullable<
  Awaited<ReturnType<typeof budgetControllerUpsert>>
>
export type BudgetControllerUpsertMutationBody = UpsertBudgetPayloadDto
export type BudgetControllerUpsertMutationError = UnauthorizedDto

/**
 * @summary Create or update a budget for a category/month/year
 */
export const useBudgetControllerUpsert = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof budgetControllerUpsert>>,
      TError,
      { data: UpsertBudgetPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof budgetControllerUpsert>>,
  TError,
  { data: UpsertBudgetPayloadDto },
  TContext
> => {
  return useMutation(
    getBudgetControllerUpsertMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Copy budgets from the previous month
 */
export type budgetControllerCopyFromPreviousMonthResponse200 = {
  data: BudgetControllerCopyFromPreviousMonth200
  status: 200
}

export type budgetControllerCopyFromPreviousMonthResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type budgetControllerCopyFromPreviousMonthResponseSuccess =
  budgetControllerCopyFromPreviousMonthResponse200 & {
    headers: Headers
  }
export type budgetControllerCopyFromPreviousMonthResponseError =
  budgetControllerCopyFromPreviousMonthResponse401 & {
    headers: Headers
  }

export type budgetControllerCopyFromPreviousMonthResponse =
  | budgetControllerCopyFromPreviousMonthResponseSuccess
  | budgetControllerCopyFromPreviousMonthResponseError

export const getBudgetControllerCopyFromPreviousMonthUrl = () => {
  return `/budgets/copy`
}

export const budgetControllerCopyFromPreviousMonth = async (
  copyBudgetPayloadDto: CopyBudgetPayloadDto,
  options?: RequestInit,
): Promise<budgetControllerCopyFromPreviousMonthResponse> => {
  return axiosInstance<budgetControllerCopyFromPreviousMonthResponse>(
    getBudgetControllerCopyFromPreviousMonthUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(copyBudgetPayloadDto),
    },
  )
}

export const getBudgetControllerCopyFromPreviousMonthMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof budgetControllerCopyFromPreviousMonth>>,
    TError,
    { data: CopyBudgetPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof budgetControllerCopyFromPreviousMonth>>,
  TError,
  { data: CopyBudgetPayloadDto },
  TContext
> => {
  const mutationKey = ['budgetControllerCopyFromPreviousMonth']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof budgetControllerCopyFromPreviousMonth>>,
    { data: CopyBudgetPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return budgetControllerCopyFromPreviousMonth(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type BudgetControllerCopyFromPreviousMonthMutationResult = NonNullable<
  Awaited<ReturnType<typeof budgetControllerCopyFromPreviousMonth>>
>
export type BudgetControllerCopyFromPreviousMonthMutationBody =
  CopyBudgetPayloadDto
export type BudgetControllerCopyFromPreviousMonthMutationError = UnauthorizedDto

/**
 * @summary Copy budgets from the previous month
 */
export const useBudgetControllerCopyFromPreviousMonth = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof budgetControllerCopyFromPreviousMonth>>,
      TError,
      { data: CopyBudgetPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof budgetControllerCopyFromPreviousMonth>>,
  TError,
  { data: CopyBudgetPayloadDto },
  TContext
> => {
  return useMutation(
    getBudgetControllerCopyFromPreviousMonthMutationOptions(options),
    queryClient,
  )
}
