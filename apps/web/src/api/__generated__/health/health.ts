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
import type { AppControllerGetHealth200 } from '../models'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * @summary Health Check
 */
export type appControllerGetHealthResponse200 = {
  data: AppControllerGetHealth200
  status: 200
}

export type appControllerGetHealthResponseSuccess =
  appControllerGetHealthResponse200 & {
    headers: Headers
  }
export type appControllerGetHealthResponse =
  appControllerGetHealthResponseSuccess

export const getAppControllerGetHealthUrl = () => {
  return `/health`
}

export const appControllerGetHealth = async (
  options?: RequestInit,
): Promise<appControllerGetHealthResponse> => {
  return axiosInstance<appControllerGetHealthResponse>(
    getAppControllerGetHealthUrl(),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getAppControllerGetHealthQueryKey = () => {
  return [`/health`] as const
}

export const getAppControllerGetHealthQueryOptions = <
  TData = Awaited<ReturnType<typeof appControllerGetHealth>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof appControllerGetHealth>>,
      TError,
      TData
    >
  >
  request?: SecondParameter<typeof axiosInstance>
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey = queryOptions?.queryKey ?? getAppControllerGetHealthQueryKey()

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof appControllerGetHealth>>
  > = ({ signal }) => appControllerGetHealth({ signal, ...requestOptions })

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof appControllerGetHealth>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AppControllerGetHealthQueryResult = NonNullable<
  Awaited<ReturnType<typeof appControllerGetHealth>>
>
export type AppControllerGetHealthQueryError = unknown

export function useAppControllerGetHealth<
  TData = Awaited<ReturnType<typeof appControllerGetHealth>>,
  TError = unknown,
>(
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof appControllerGetHealth>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetHealth>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetHealth>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useAppControllerGetHealth<
  TData = Awaited<ReturnType<typeof appControllerGetHealth>>,
  TError = unknown,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof appControllerGetHealth>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetHealth>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetHealth>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useAppControllerGetHealth<
  TData = Awaited<ReturnType<typeof appControllerGetHealth>>,
  TError = unknown,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof appControllerGetHealth>>,
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
 * @summary Health Check
 */

export function useAppControllerGetHealth<
  TData = Awaited<ReturnType<typeof appControllerGetHealth>>,
  TError = unknown,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof appControllerGetHealth>>,
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
  const queryOptions = getAppControllerGetHealthQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}
