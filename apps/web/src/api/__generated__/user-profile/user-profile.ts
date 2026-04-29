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
  UserProfileControllerFindOne200,
  UserProfileControllerFindOne400,
  UserProfileControllerUpdate200,
  UserProfileControllerUpdate400,
  UserProfilePayloadDto,
  UserUnauthorizedDto,
} from '../models'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * @summary Get a user profile
 */
export type userProfileControllerFindOneResponse200 = {
  data: UserProfileControllerFindOne200
  status: 200
}

export type userProfileControllerFindOneResponse400 = {
  data: UserProfileControllerFindOne400
  status: 400
}

export type userProfileControllerFindOneResponse401 = {
  data: UserUnauthorizedDto
  status: 401
}

export type userProfileControllerFindOneResponseSuccess =
  userProfileControllerFindOneResponse200 & {
    headers: Headers
  }
export type userProfileControllerFindOneResponseError = (
  | userProfileControllerFindOneResponse400
  | userProfileControllerFindOneResponse401
) & {
  headers: Headers
}

export type userProfileControllerFindOneResponse =
  | userProfileControllerFindOneResponseSuccess
  | userProfileControllerFindOneResponseError

export const getUserProfileControllerFindOneUrl = () => {
  return `/user/profile`
}

export const userProfileControllerFindOne = async (
  options?: RequestInit,
): Promise<userProfileControllerFindOneResponse> => {
  return axiosInstance<userProfileControllerFindOneResponse>(
    getUserProfileControllerFindOneUrl(),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getUserProfileControllerFindOneQueryKey = () => {
  return [`/user/profile`] as const
}

export const getUserProfileControllerFindOneQueryOptions = <
  TData = Awaited<ReturnType<typeof userProfileControllerFindOne>>,
  TError = UserProfileControllerFindOne400 | UserUnauthorizedDto,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof userProfileControllerFindOne>>,
      TError,
      TData
    >
  >
  request?: SecondParameter<typeof axiosInstance>
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getUserProfileControllerFindOneQueryKey()

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof userProfileControllerFindOne>>
  > = ({ signal }) =>
    userProfileControllerFindOne({ signal, ...requestOptions })

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof userProfileControllerFindOne>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserProfileControllerFindOneQueryResult = NonNullable<
  Awaited<ReturnType<typeof userProfileControllerFindOne>>
>
export type UserProfileControllerFindOneQueryError =
  | UserProfileControllerFindOne400
  | UserUnauthorizedDto

export function useUserProfileControllerFindOne<
  TData = Awaited<ReturnType<typeof userProfileControllerFindOne>>,
  TError = UserProfileControllerFindOne400 | UserUnauthorizedDto,
>(
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userProfileControllerFindOne>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userProfileControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof userProfileControllerFindOne>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useUserProfileControllerFindOne<
  TData = Awaited<ReturnType<typeof userProfileControllerFindOne>>,
  TError = UserProfileControllerFindOne400 | UserUnauthorizedDto,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userProfileControllerFindOne>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userProfileControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof userProfileControllerFindOne>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useUserProfileControllerFindOne<
  TData = Awaited<ReturnType<typeof userProfileControllerFindOne>>,
  TError = UserProfileControllerFindOne400 | UserUnauthorizedDto,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userProfileControllerFindOne>>,
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
 * @summary Get a user profile
 */

export function useUserProfileControllerFindOne<
  TData = Awaited<ReturnType<typeof userProfileControllerFindOne>>,
  TError = UserProfileControllerFindOne400 | UserUnauthorizedDto,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userProfileControllerFindOne>>,
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
  const queryOptions = getUserProfileControllerFindOneQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}

/**
 * @summary Update a user profile
 */
export type userProfileControllerUpdateResponse200 = {
  data: UserProfileControllerUpdate200
  status: 200
}

export type userProfileControllerUpdateResponse400 = {
  data: UserProfileControllerUpdate400
  status: 400
}

export type userProfileControllerUpdateResponse401 = {
  data: UserUnauthorizedDto
  status: 401
}

export type userProfileControllerUpdateResponseSuccess =
  userProfileControllerUpdateResponse200 & {
    headers: Headers
  }
export type userProfileControllerUpdateResponseError = (
  | userProfileControllerUpdateResponse400
  | userProfileControllerUpdateResponse401
) & {
  headers: Headers
}

export type userProfileControllerUpdateResponse =
  | userProfileControllerUpdateResponseSuccess
  | userProfileControllerUpdateResponseError

export const getUserProfileControllerUpdateUrl = () => {
  return `/user/profile`
}

export const userProfileControllerUpdate = async (
  userProfilePayloadDto: UserProfilePayloadDto,
  options?: RequestInit,
): Promise<userProfileControllerUpdateResponse> => {
  return axiosInstance<userProfileControllerUpdateResponse>(
    getUserProfileControllerUpdateUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(userProfilePayloadDto),
    },
  )
}

export const getUserProfileControllerUpdateMutationOptions = <
  TError = UserProfileControllerUpdate400 | UserUnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userProfileControllerUpdate>>,
    TError,
    { data: UserProfilePayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof userProfileControllerUpdate>>,
  TError,
  { data: UserProfilePayloadDto },
  TContext
> => {
  const mutationKey = ['userProfileControllerUpdate']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof userProfileControllerUpdate>>,
    { data: UserProfilePayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return userProfileControllerUpdate(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type UserProfileControllerUpdateMutationResult = NonNullable<
  Awaited<ReturnType<typeof userProfileControllerUpdate>>
>
export type UserProfileControllerUpdateMutationBody = UserProfilePayloadDto
export type UserProfileControllerUpdateMutationError =
  | UserProfileControllerUpdate400
  | UserUnauthorizedDto

/**
 * @summary Update a user profile
 */
export const useUserProfileControllerUpdate = <
  TError = UserProfileControllerUpdate400 | UserUnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof userProfileControllerUpdate>>,
      TError,
      { data: UserProfilePayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof userProfileControllerUpdate>>,
  TError,
  { data: UserProfilePayloadDto },
  TContext
> => {
  return useMutation(
    getUserProfileControllerUpdateMutationOptions(options),
    queryClient,
  )
}
