import { useQuery } from '@tanstack/react-query'
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'

import { axiosInstance } from '../../axios-instance'
import type {
  DashboardControllerGetDashboard200,
  DashboardControllerGetDashboardParams,
  UnauthorizedDto,
} from '../models'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * @summary Get dashboard summary for a given month/year
 */
export type dashboardControllerGetDashboardResponse200 = {
  data: DashboardControllerGetDashboard200
  status: 200
}

export type dashboardControllerGetDashboardResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type dashboardControllerGetDashboardResponseSuccess =
  dashboardControllerGetDashboardResponse200 & {
    headers: Headers
  }
export type dashboardControllerGetDashboardResponseError =
  dashboardControllerGetDashboardResponse401 & {
    headers: Headers
  }

export type dashboardControllerGetDashboardResponse =
  | dashboardControllerGetDashboardResponseSuccess
  | dashboardControllerGetDashboardResponseError

export const getDashboardControllerGetDashboardUrl = (
  params: DashboardControllerGetDashboardParams,
) => {
  const normalizedParams = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  })

  const stringifiedParams = normalizedParams.toString()

  return stringifiedParams.length > 0
    ? `/dashboard?${stringifiedParams}`
    : `/dashboard`
}

export const dashboardControllerGetDashboard = async (
  params: DashboardControllerGetDashboardParams,
  options?: RequestInit,
): Promise<dashboardControllerGetDashboardResponse> => {
  return axiosInstance<dashboardControllerGetDashboardResponse>(
    getDashboardControllerGetDashboardUrl(params),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getDashboardControllerGetDashboardQueryKey = (
  params?: DashboardControllerGetDashboardParams,
) => {
  return [`/dashboard`, ...(params ? [params] : [])] as const
}

export const getDashboardControllerGetDashboardQueryOptions = <
  TData = Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
  TError = UnauthorizedDto,
>(
  params: DashboardControllerGetDashboardParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof axiosInstance>
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getDashboardControllerGetDashboardQueryKey(params)

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof dashboardControllerGetDashboard>>
  > = ({ signal }) =>
    dashboardControllerGetDashboard(params, { signal, ...requestOptions })

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type DashboardControllerGetDashboardQueryResult = NonNullable<
  Awaited<ReturnType<typeof dashboardControllerGetDashboard>>
>
export type DashboardControllerGetDashboardQueryError = UnauthorizedDto

export function useDashboardControllerGetDashboard<
  TData = Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
  TError = UnauthorizedDto,
>(
  params: DashboardControllerGetDashboardParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetDashboard>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useDashboardControllerGetDashboard<
  TData = Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
  TError = UnauthorizedDto,
>(
  params: DashboardControllerGetDashboardParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetDashboard>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useDashboardControllerGetDashboard<
  TData = Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
  TError = UnauthorizedDto,
>(
  params: DashboardControllerGetDashboardParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
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
 * @summary Get dashboard summary for a given month/year
 */

export function useDashboardControllerGetDashboard<
  TData = Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
  TError = UnauthorizedDto,
>(
  params: DashboardControllerGetDashboardParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
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
  const queryOptions = getDashboardControllerGetDashboardQueryOptions(
    params,
    options,
  )

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}
