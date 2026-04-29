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
  UserControllerCreate201,
  UserControllerCreate400,
  UserControllerDelete200,
  UserControllerDelete400,
  UserControllerFindAll200,
  UserControllerFindAllParams,
  UserControllerFindOne200,
  UserControllerFindOne400,
  UserControllerUpdate200,
  UserControllerUpdate400,
  UserPayloadDto,
  UserUnauthorizedDto,
  UserUpdatePayloadDto,
} from '../models'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * @summary Get all users
 */
export type userControllerFindAllResponse200 = {
  data: UserControllerFindAll200
  status: 200
}

export type userControllerFindAllResponse401 = {
  data: UserUnauthorizedDto
  status: 401
}

export type userControllerFindAllResponseSuccess =
  userControllerFindAllResponse200 & {
    headers: Headers
  }
export type userControllerFindAllResponseError =
  userControllerFindAllResponse401 & {
    headers: Headers
  }

export type userControllerFindAllResponse =
  | userControllerFindAllResponseSuccess
  | userControllerFindAllResponseError

export const getUserControllerFindAllUrl = (
  params: UserControllerFindAllParams,
) => {
  const normalizedParams = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  })

  const stringifiedParams = normalizedParams.toString()

  return stringifiedParams.length > 0 ? `/users?${stringifiedParams}` : `/users`
}

export const userControllerFindAll = async (
  params: UserControllerFindAllParams,
  options?: RequestInit,
): Promise<userControllerFindAllResponse> => {
  return axiosInstance<userControllerFindAllResponse>(
    getUserControllerFindAllUrl(params),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getUserControllerFindAllQueryKey = (
  params?: UserControllerFindAllParams,
) => {
  return [`/users`, ...(params ? [params] : [])] as const
}

export const getUserControllerFindAllQueryOptions = <
  TData = Awaited<ReturnType<typeof userControllerFindAll>>,
  TError = UserUnauthorizedDto,
>(
  params: UserControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userControllerFindAll>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof axiosInstance>
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getUserControllerFindAllQueryKey(params)

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof userControllerFindAll>>
  > = ({ signal }) =>
    userControllerFindAll(params, { signal, ...requestOptions })

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof userControllerFindAll>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserControllerFindAllQueryResult = NonNullable<
  Awaited<ReturnType<typeof userControllerFindAll>>
>
export type UserControllerFindAllQueryError = UserUnauthorizedDto

export function useUserControllerFindAll<
  TData = Awaited<ReturnType<typeof userControllerFindAll>>,
  TError = UserUnauthorizedDto,
>(
  params: UserControllerFindAllParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof userControllerFindAll>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useUserControllerFindAll<
  TData = Awaited<ReturnType<typeof userControllerFindAll>>,
  TError = UserUnauthorizedDto,
>(
  params: UserControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof userControllerFindAll>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useUserControllerFindAll<
  TData = Awaited<ReturnType<typeof userControllerFindAll>>,
  TError = UserUnauthorizedDto,
>(
  params: UserControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userControllerFindAll>>,
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
 * @summary Get all users
 */

export function useUserControllerFindAll<
  TData = Awaited<ReturnType<typeof userControllerFindAll>>,
  TError = UserUnauthorizedDto,
>(
  params: UserControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userControllerFindAll>>,
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
  const queryOptions = getUserControllerFindAllQueryOptions(params, options)

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}

/**
 * @summary Create an user
 */
export type userControllerCreateResponse201 = {
  data: UserControllerCreate201
  status: 201
}

export type userControllerCreateResponse400 = {
  data: UserControllerCreate400
  status: 400
}

export type userControllerCreateResponse401 = {
  data: UserUnauthorizedDto
  status: 401
}

export type userControllerCreateResponseSuccess =
  userControllerCreateResponse201 & {
    headers: Headers
  }
export type userControllerCreateResponseError = (
  | userControllerCreateResponse400
  | userControllerCreateResponse401
) & {
  headers: Headers
}

export type userControllerCreateResponse =
  | userControllerCreateResponseSuccess
  | userControllerCreateResponseError

export const getUserControllerCreateUrl = () => {
  return `/users`
}

export const userControllerCreate = async (
  userPayloadDto: UserPayloadDto,
  options?: RequestInit,
): Promise<userControllerCreateResponse> => {
  return axiosInstance<userControllerCreateResponse>(
    getUserControllerCreateUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(userPayloadDto),
    },
  )
}

export const getUserControllerCreateMutationOptions = <
  TError = UserControllerCreate400 | UserUnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userControllerCreate>>,
    TError,
    { data: UserPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof userControllerCreate>>,
  TError,
  { data: UserPayloadDto },
  TContext
> => {
  const mutationKey = ['userControllerCreate']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof userControllerCreate>>,
    { data: UserPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return userControllerCreate(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type UserControllerCreateMutationResult = NonNullable<
  Awaited<ReturnType<typeof userControllerCreate>>
>
export type UserControllerCreateMutationBody = UserPayloadDto
export type UserControllerCreateMutationError =
  | UserControllerCreate400
  | UserUnauthorizedDto

/**
 * @summary Create an user
 */
export const useUserControllerCreate = <
  TError = UserControllerCreate400 | UserUnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof userControllerCreate>>,
      TError,
      { data: UserPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof userControllerCreate>>,
  TError,
  { data: UserPayloadDto },
  TContext
> => {
  return useMutation(
    getUserControllerCreateMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Get an user by id
 */
export type userControllerFindOneResponse200 = {
  data: UserControllerFindOne200
  status: 200
}

export type userControllerFindOneResponse400 = {
  data: UserControllerFindOne400
  status: 400
}

export type userControllerFindOneResponse401 = {
  data: UserUnauthorizedDto
  status: 401
}

export type userControllerFindOneResponseSuccess =
  userControllerFindOneResponse200 & {
    headers: Headers
  }
export type userControllerFindOneResponseError = (
  | userControllerFindOneResponse400
  | userControllerFindOneResponse401
) & {
  headers: Headers
}

export type userControllerFindOneResponse =
  | userControllerFindOneResponseSuccess
  | userControllerFindOneResponseError

export const getUserControllerFindOneUrl = (id: string) => {
  return `/users/${id}`
}

export const userControllerFindOne = async (
  id: string,
  options?: RequestInit,
): Promise<userControllerFindOneResponse> => {
  return axiosInstance<userControllerFindOneResponse>(
    getUserControllerFindOneUrl(id),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getUserControllerFindOneQueryKey = (id: string) => {
  return [`/users/${id}`] as const
}

export const getUserControllerFindOneQueryOptions = <
  TData = Awaited<ReturnType<typeof userControllerFindOne>>,
  TError = UserControllerFindOne400 | UserUnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userControllerFindOne>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof axiosInstance>
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getUserControllerFindOneQueryKey(id)

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof userControllerFindOne>>
  > = ({ signal }) => userControllerFindOne(id, { signal, ...requestOptions })

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof userControllerFindOne>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserControllerFindOneQueryResult = NonNullable<
  Awaited<ReturnType<typeof userControllerFindOne>>
>
export type UserControllerFindOneQueryError =
  | UserControllerFindOne400
  | UserUnauthorizedDto

export function useUserControllerFindOne<
  TData = Awaited<ReturnType<typeof userControllerFindOne>>,
  TError = UserControllerFindOne400 | UserUnauthorizedDto,
>(
  id: string,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userControllerFindOne>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof userControllerFindOne>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useUserControllerFindOne<
  TData = Awaited<ReturnType<typeof userControllerFindOne>>,
  TError = UserControllerFindOne400 | UserUnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userControllerFindOne>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof userControllerFindOne>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useUserControllerFindOne<
  TData = Awaited<ReturnType<typeof userControllerFindOne>>,
  TError = UserControllerFindOne400 | UserUnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userControllerFindOne>>,
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
 * @summary Get an user by id
 */

export function useUserControllerFindOne<
  TData = Awaited<ReturnType<typeof userControllerFindOne>>,
  TError = UserControllerFindOne400 | UserUnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof userControllerFindOne>>,
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
  const queryOptions = getUserControllerFindOneQueryOptions(id, options)

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}

/**
 * @summary Update an user
 */
export type userControllerUpdateResponse200 = {
  data: UserControllerUpdate200
  status: 200
}

export type userControllerUpdateResponse400 = {
  data: UserControllerUpdate400
  status: 400
}

export type userControllerUpdateResponse401 = {
  data: UserUnauthorizedDto
  status: 401
}

export type userControllerUpdateResponseSuccess =
  userControllerUpdateResponse200 & {
    headers: Headers
  }
export type userControllerUpdateResponseError = (
  | userControllerUpdateResponse400
  | userControllerUpdateResponse401
) & {
  headers: Headers
}

export type userControllerUpdateResponse =
  | userControllerUpdateResponseSuccess
  | userControllerUpdateResponseError

export const getUserControllerUpdateUrl = (id: string) => {
  return `/users/${id}`
}

export const userControllerUpdate = async (
  id: string,
  userUpdatePayloadDto: UserUpdatePayloadDto,
  options?: RequestInit,
): Promise<userControllerUpdateResponse> => {
  return axiosInstance<userControllerUpdateResponse>(
    getUserControllerUpdateUrl(id),
    {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(userUpdatePayloadDto),
    },
  )
}

export const getUserControllerUpdateMutationOptions = <
  TError = UserControllerUpdate400 | UserUnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userControllerUpdate>>,
    TError,
    { id: string; data: UserUpdatePayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof userControllerUpdate>>,
  TError,
  { id: string; data: UserUpdatePayloadDto },
  TContext
> => {
  const mutationKey = ['userControllerUpdate']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof userControllerUpdate>>,
    { id: string; data: UserUpdatePayloadDto }
  > = (props) => {
    const { id, data } = props ?? {}

    return userControllerUpdate(id, data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type UserControllerUpdateMutationResult = NonNullable<
  Awaited<ReturnType<typeof userControllerUpdate>>
>
export type UserControllerUpdateMutationBody = UserUpdatePayloadDto
export type UserControllerUpdateMutationError =
  | UserControllerUpdate400
  | UserUnauthorizedDto

/**
 * @summary Update an user
 */
export const useUserControllerUpdate = <
  TError = UserControllerUpdate400 | UserUnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof userControllerUpdate>>,
      TError,
      { id: string; data: UserUpdatePayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof userControllerUpdate>>,
  TError,
  { id: string; data: UserUpdatePayloadDto },
  TContext
> => {
  return useMutation(
    getUserControllerUpdateMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Delete an user
 */
export type userControllerDeleteResponse200 = {
  data: UserControllerDelete200
  status: 200
}

export type userControllerDeleteResponse400 = {
  data: UserControllerDelete400
  status: 400
}

export type userControllerDeleteResponse401 = {
  data: UserUnauthorizedDto
  status: 401
}

export type userControllerDeleteResponseSuccess =
  userControllerDeleteResponse200 & {
    headers: Headers
  }
export type userControllerDeleteResponseError = (
  | userControllerDeleteResponse400
  | userControllerDeleteResponse401
) & {
  headers: Headers
}

export type userControllerDeleteResponse =
  | userControllerDeleteResponseSuccess
  | userControllerDeleteResponseError

export const getUserControllerDeleteUrl = (ids: string) => {
  return `/users/${ids}`
}

export const userControllerDelete = async (
  ids: string,
  options?: RequestInit,
): Promise<userControllerDeleteResponse> => {
  return axiosInstance<userControllerDeleteResponse>(
    getUserControllerDeleteUrl(ids),
    {
      ...options,
      method: 'DELETE',
    },
  )
}

export const getUserControllerDeleteMutationOptions = <
  TError = UserControllerDelete400 | UserUnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userControllerDelete>>,
    TError,
    { ids: string },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof userControllerDelete>>,
  TError,
  { ids: string },
  TContext
> => {
  const mutationKey = ['userControllerDelete']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof userControllerDelete>>,
    { ids: string }
  > = (props) => {
    const { ids } = props ?? {}

    return userControllerDelete(ids, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type UserControllerDeleteMutationResult = NonNullable<
  Awaited<ReturnType<typeof userControllerDelete>>
>

export type UserControllerDeleteMutationError =
  | UserControllerDelete400
  | UserUnauthorizedDto

/**
 * @summary Delete an user
 */
export const useUserControllerDelete = <
  TError = UserControllerDelete400 | UserUnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof userControllerDelete>>,
      TError,
      { ids: string },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof userControllerDelete>>,
  TError,
  { ids: string },
  TContext
> => {
  return useMutation(
    getUserControllerDeleteMutationOptions(options),
    queryClient,
  )
}
