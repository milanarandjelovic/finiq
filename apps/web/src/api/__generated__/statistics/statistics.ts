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
  StatisticsControllerGetStatistics200,
  StatisticsControllerGetStatisticsParams,
  UnauthorizedDto,
} from '../models'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * @summary Get spending by category and 6-month trend
 */
export type statisticsControllerGetStatisticsResponse200 = {
  data: StatisticsControllerGetStatistics200
  status: 200
}

export type statisticsControllerGetStatisticsResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type statisticsControllerGetStatisticsResponseSuccess =
  statisticsControllerGetStatisticsResponse200 & {
    headers: Headers
  }
export type statisticsControllerGetStatisticsResponseError =
  statisticsControllerGetStatisticsResponse401 & {
    headers: Headers
  }

export type statisticsControllerGetStatisticsResponse =
  | statisticsControllerGetStatisticsResponseSuccess
  | statisticsControllerGetStatisticsResponseError

export const getStatisticsControllerGetStatisticsUrl = (
  params: StatisticsControllerGetStatisticsParams,
) => {
  const normalizedParams = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  })

  const stringifiedParams = normalizedParams.toString()

  return stringifiedParams.length > 0
    ? `/statistics?${stringifiedParams}`
    : `/statistics`
}

export const statisticsControllerGetStatistics = async (
  params: StatisticsControllerGetStatisticsParams,
  options?: RequestInit,
): Promise<statisticsControllerGetStatisticsResponse> => {
  return axiosInstance<statisticsControllerGetStatisticsResponse>(
    getStatisticsControllerGetStatisticsUrl(params),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getStatisticsControllerGetStatisticsQueryKey = (
  params?: StatisticsControllerGetStatisticsParams,
) => {
  return [`/statistics`, ...(params ? [params] : [])] as const
}

export const getStatisticsControllerGetStatisticsQueryOptions = <
  TData = Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
  TError = UnauthorizedDto,
>(
  params: StatisticsControllerGetStatisticsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof axiosInstance>
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ??
    getStatisticsControllerGetStatisticsQueryKey(params)

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof statisticsControllerGetStatistics>>
  > = ({ signal }) =>
    statisticsControllerGetStatistics(params, { signal, ...requestOptions })

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type StatisticsControllerGetStatisticsQueryResult = NonNullable<
  Awaited<ReturnType<typeof statisticsControllerGetStatistics>>
>
export type StatisticsControllerGetStatisticsQueryError = UnauthorizedDto

export function useStatisticsControllerGetStatistics<
  TData = Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
  TError = UnauthorizedDto,
>(
  params: StatisticsControllerGetStatisticsParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
          TError,
          Awaited<ReturnType<typeof statisticsControllerGetStatistics>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useStatisticsControllerGetStatistics<
  TData = Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
  TError = UnauthorizedDto,
>(
  params: StatisticsControllerGetStatisticsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
          TError,
          Awaited<ReturnType<typeof statisticsControllerGetStatistics>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useStatisticsControllerGetStatistics<
  TData = Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
  TError = UnauthorizedDto,
>(
  params: StatisticsControllerGetStatisticsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
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
 * @summary Get spending by category and 6-month trend
 */

export function useStatisticsControllerGetStatistics<
  TData = Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
  TError = UnauthorizedDto,
>(
  params: StatisticsControllerGetStatisticsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof statisticsControllerGetStatistics>>,
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
  const queryOptions = getStatisticsControllerGetStatisticsQueryOptions(
    params,
    options,
  )

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}
