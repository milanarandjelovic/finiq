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
  SettingControllerFindAll200,
  SettingControllerUpdate200,
  UnauthorizedDto,
  UpdateSettingsPayloadDto,
} from '../models'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * @summary Get settings for the authenticated user
 */
export type settingControllerFindAllResponse200 = {
  data: SettingControllerFindAll200
  status: 200
}

export type settingControllerFindAllResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type settingControllerFindAllResponseSuccess =
  settingControllerFindAllResponse200 & {
    headers: Headers
  }
export type settingControllerFindAllResponseError =
  settingControllerFindAllResponse401 & {
    headers: Headers
  }

export type settingControllerFindAllResponse =
  | settingControllerFindAllResponseSuccess
  | settingControllerFindAllResponseError

export const getSettingControllerFindAllUrl = () => {
  return `/settings`
}

export const settingControllerFindAll = async (
  options?: RequestInit,
): Promise<settingControllerFindAllResponse> => {
  return axiosInstance<settingControllerFindAllResponse>(
    getSettingControllerFindAllUrl(),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getSettingControllerFindAllQueryKey = () => {
  return [`/settings`] as const
}

export const getSettingControllerFindAllQueryOptions = <
  TData = Awaited<ReturnType<typeof settingControllerFindAll>>,
  TError = UnauthorizedDto,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof settingControllerFindAll>>,
      TError,
      TData
    >
  >
  request?: SecondParameter<typeof axiosInstance>
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getSettingControllerFindAllQueryKey()

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof settingControllerFindAll>>
  > = ({ signal }) => settingControllerFindAll({ signal, ...requestOptions })

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof settingControllerFindAll>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SettingControllerFindAllQueryResult = NonNullable<
  Awaited<ReturnType<typeof settingControllerFindAll>>
>
export type SettingControllerFindAllQueryError = UnauthorizedDto

export function useSettingControllerFindAll<
  TData = Awaited<ReturnType<typeof settingControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof settingControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof settingControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof settingControllerFindAll>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useSettingControllerFindAll<
  TData = Awaited<ReturnType<typeof settingControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof settingControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof settingControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof settingControllerFindAll>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useSettingControllerFindAll<
  TData = Awaited<ReturnType<typeof settingControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof settingControllerFindAll>>,
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
 * @summary Get settings for the authenticated user
 */

export function useSettingControllerFindAll<
  TData = Awaited<ReturnType<typeof settingControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof settingControllerFindAll>>,
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
  const queryOptions = getSettingControllerFindAllQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}

/**
 * @summary Update settings for the authenticated user
 */
export type settingControllerUpdateResponse200 = {
  data: SettingControllerUpdate200
  status: 200
}

export type settingControllerUpdateResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type settingControllerUpdateResponseSuccess =
  settingControllerUpdateResponse200 & {
    headers: Headers
  }
export type settingControllerUpdateResponseError =
  settingControllerUpdateResponse401 & {
    headers: Headers
  }

export type settingControllerUpdateResponse =
  | settingControllerUpdateResponseSuccess
  | settingControllerUpdateResponseError

export const getSettingControllerUpdateUrl = () => {
  return `/settings`
}

export const settingControllerUpdate = async (
  updateSettingsPayloadDto: UpdateSettingsPayloadDto,
  options?: RequestInit,
): Promise<settingControllerUpdateResponse> => {
  return axiosInstance<settingControllerUpdateResponse>(
    getSettingControllerUpdateUrl(),
    {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(updateSettingsPayloadDto),
    },
  )
}

export const getSettingControllerUpdateMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof settingControllerUpdate>>,
    TError,
    { data: UpdateSettingsPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof settingControllerUpdate>>,
  TError,
  { data: UpdateSettingsPayloadDto },
  TContext
> => {
  const mutationKey = ['settingControllerUpdate']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof settingControllerUpdate>>,
    { data: UpdateSettingsPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return settingControllerUpdate(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type SettingControllerUpdateMutationResult = NonNullable<
  Awaited<ReturnType<typeof settingControllerUpdate>>
>
export type SettingControllerUpdateMutationBody = UpdateSettingsPayloadDto
export type SettingControllerUpdateMutationError = UnauthorizedDto

/**
 * @summary Update settings for the authenticated user
 */
export const useSettingControllerUpdate = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof settingControllerUpdate>>,
      TError,
      { data: UpdateSettingsPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof settingControllerUpdate>>,
  TError,
  { data: UpdateSettingsPayloadDto },
  TContext
> => {
  return useMutation(
    getSettingControllerUpdateMutationOptions(options),
    queryClient,
  )
}
