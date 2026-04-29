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
  CategoryControllerCreate201,
  CategoryControllerDelete200,
  CategoryControllerFindAll200,
  CategoryControllerFindAllParams,
  CategoryControllerFindOne200,
  CategoryControllerUpdate200,
  CreateCategoryPayloadDto,
  UnauthorizedDto,
  UpdateCategoryPayloadDto,
} from '../models'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * @summary Get all categories for the authenticated user
 */
export type categoryControllerFindAllResponse200 = {
  data: CategoryControllerFindAll200
  status: 200
}

export type categoryControllerFindAllResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type categoryControllerFindAllResponseSuccess =
  categoryControllerFindAllResponse200 & {
    headers: Headers
  }
export type categoryControllerFindAllResponseError =
  categoryControllerFindAllResponse401 & {
    headers: Headers
  }

export type categoryControllerFindAllResponse =
  | categoryControllerFindAllResponseSuccess
  | categoryControllerFindAllResponseError

export const getCategoryControllerFindAllUrl = (
  params?: CategoryControllerFindAllParams,
) => {
  const normalizedParams = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  })

  const stringifiedParams = normalizedParams.toString()

  return stringifiedParams.length > 0
    ? `/categories?${stringifiedParams}`
    : `/categories`
}

export const categoryControllerFindAll = async (
  params?: CategoryControllerFindAllParams,
  options?: RequestInit,
): Promise<categoryControllerFindAllResponse> => {
  return axiosInstance<categoryControllerFindAllResponse>(
    getCategoryControllerFindAllUrl(params),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getCategoryControllerFindAllQueryKey = (
  params?: CategoryControllerFindAllParams,
) => {
  return [`/categories`, ...(params ? [params] : [])] as const
}

export const getCategoryControllerFindAllQueryOptions = <
  TData = Awaited<ReturnType<typeof categoryControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params?: CategoryControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof categoryControllerFindAll>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof axiosInstance>
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getCategoryControllerFindAllQueryKey(params)

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof categoryControllerFindAll>>
  > = ({ signal }) =>
    categoryControllerFindAll(params, { signal, ...requestOptions })

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof categoryControllerFindAll>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CategoryControllerFindAllQueryResult = NonNullable<
  Awaited<ReturnType<typeof categoryControllerFindAll>>
>
export type CategoryControllerFindAllQueryError = UnauthorizedDto

export function useCategoryControllerFindAll<
  TData = Awaited<ReturnType<typeof categoryControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params: undefined | CategoryControllerFindAllParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof categoryControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof categoryControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof categoryControllerFindAll>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useCategoryControllerFindAll<
  TData = Awaited<ReturnType<typeof categoryControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params?: CategoryControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof categoryControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof categoryControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof categoryControllerFindAll>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useCategoryControllerFindAll<
  TData = Awaited<ReturnType<typeof categoryControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params?: CategoryControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof categoryControllerFindAll>>,
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
 * @summary Get all categories for the authenticated user
 */

export function useCategoryControllerFindAll<
  TData = Awaited<ReturnType<typeof categoryControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params?: CategoryControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof categoryControllerFindAll>>,
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
  const queryOptions = getCategoryControllerFindAllQueryOptions(params, options)

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}

/**
 * @summary Create a category
 */
export type categoryControllerCreateResponse201 = {
  data: CategoryControllerCreate201
  status: 201
}

export type categoryControllerCreateResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type categoryControllerCreateResponseSuccess =
  categoryControllerCreateResponse201 & {
    headers: Headers
  }
export type categoryControllerCreateResponseError =
  categoryControllerCreateResponse401 & {
    headers: Headers
  }

export type categoryControllerCreateResponse =
  | categoryControllerCreateResponseSuccess
  | categoryControllerCreateResponseError

export const getCategoryControllerCreateUrl = () => {
  return `/categories`
}

export const categoryControllerCreate = async (
  createCategoryPayloadDto: CreateCategoryPayloadDto,
  options?: RequestInit,
): Promise<categoryControllerCreateResponse> => {
  return axiosInstance<categoryControllerCreateResponse>(
    getCategoryControllerCreateUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(createCategoryPayloadDto),
    },
  )
}

export const getCategoryControllerCreateMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof categoryControllerCreate>>,
    TError,
    { data: CreateCategoryPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof categoryControllerCreate>>,
  TError,
  { data: CreateCategoryPayloadDto },
  TContext
> => {
  const mutationKey = ['categoryControllerCreate']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof categoryControllerCreate>>,
    { data: CreateCategoryPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return categoryControllerCreate(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type CategoryControllerCreateMutationResult = NonNullable<
  Awaited<ReturnType<typeof categoryControllerCreate>>
>
export type CategoryControllerCreateMutationBody = CreateCategoryPayloadDto
export type CategoryControllerCreateMutationError = UnauthorizedDto

/**
 * @summary Create a category
 */
export const useCategoryControllerCreate = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof categoryControllerCreate>>,
      TError,
      { data: CreateCategoryPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof categoryControllerCreate>>,
  TError,
  { data: CreateCategoryPayloadDto },
  TContext
> => {
  return useMutation(
    getCategoryControllerCreateMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Get a category by id
 */
export type categoryControllerFindOneResponse200 = {
  data: CategoryControllerFindOne200
  status: 200
}

export type categoryControllerFindOneResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type categoryControllerFindOneResponseSuccess =
  categoryControllerFindOneResponse200 & {
    headers: Headers
  }
export type categoryControllerFindOneResponseError =
  categoryControllerFindOneResponse401 & {
    headers: Headers
  }

export type categoryControllerFindOneResponse =
  | categoryControllerFindOneResponseSuccess
  | categoryControllerFindOneResponseError

export const getCategoryControllerFindOneUrl = (id: string) => {
  return `/categories/${id}`
}

export const categoryControllerFindOne = async (
  id: string,
  options?: RequestInit,
): Promise<categoryControllerFindOneResponse> => {
  return axiosInstance<categoryControllerFindOneResponse>(
    getCategoryControllerFindOneUrl(id),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getCategoryControllerFindOneQueryKey = (id: string) => {
  return [`/categories/${id}`] as const
}

export const getCategoryControllerFindOneQueryOptions = <
  TData = Awaited<ReturnType<typeof categoryControllerFindOne>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof categoryControllerFindOne>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof axiosInstance>
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getCategoryControllerFindOneQueryKey(id)

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof categoryControllerFindOne>>
  > = ({ signal }) =>
    categoryControllerFindOne(id, { signal, ...requestOptions })

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof categoryControllerFindOne>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CategoryControllerFindOneQueryResult = NonNullable<
  Awaited<ReturnType<typeof categoryControllerFindOne>>
>
export type CategoryControllerFindOneQueryError = UnauthorizedDto

export function useCategoryControllerFindOne<
  TData = Awaited<ReturnType<typeof categoryControllerFindOne>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof categoryControllerFindOne>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof categoryControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof categoryControllerFindOne>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useCategoryControllerFindOne<
  TData = Awaited<ReturnType<typeof categoryControllerFindOne>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof categoryControllerFindOne>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof categoryControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof categoryControllerFindOne>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useCategoryControllerFindOne<
  TData = Awaited<ReturnType<typeof categoryControllerFindOne>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof categoryControllerFindOne>>,
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
 * @summary Get a category by id
 */

export function useCategoryControllerFindOne<
  TData = Awaited<ReturnType<typeof categoryControllerFindOne>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof categoryControllerFindOne>>,
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
  const queryOptions = getCategoryControllerFindOneQueryOptions(id, options)

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}

/**
 * @summary Update a category
 */
export type categoryControllerUpdateResponse200 = {
  data: CategoryControllerUpdate200
  status: 200
}

export type categoryControllerUpdateResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type categoryControllerUpdateResponseSuccess =
  categoryControllerUpdateResponse200 & {
    headers: Headers
  }
export type categoryControllerUpdateResponseError =
  categoryControllerUpdateResponse401 & {
    headers: Headers
  }

export type categoryControllerUpdateResponse =
  | categoryControllerUpdateResponseSuccess
  | categoryControllerUpdateResponseError

export const getCategoryControllerUpdateUrl = (id: string) => {
  return `/categories/${id}`
}

export const categoryControllerUpdate = async (
  id: string,
  updateCategoryPayloadDto: UpdateCategoryPayloadDto,
  options?: RequestInit,
): Promise<categoryControllerUpdateResponse> => {
  return axiosInstance<categoryControllerUpdateResponse>(
    getCategoryControllerUpdateUrl(id),
    {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(updateCategoryPayloadDto),
    },
  )
}

export const getCategoryControllerUpdateMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof categoryControllerUpdate>>,
    TError,
    { id: string; data: UpdateCategoryPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof categoryControllerUpdate>>,
  TError,
  { id: string; data: UpdateCategoryPayloadDto },
  TContext
> => {
  const mutationKey = ['categoryControllerUpdate']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof categoryControllerUpdate>>,
    { id: string; data: UpdateCategoryPayloadDto }
  > = (props) => {
    const { id, data } = props ?? {}

    return categoryControllerUpdate(id, data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type CategoryControllerUpdateMutationResult = NonNullable<
  Awaited<ReturnType<typeof categoryControllerUpdate>>
>
export type CategoryControllerUpdateMutationBody = UpdateCategoryPayloadDto
export type CategoryControllerUpdateMutationError = UnauthorizedDto

/**
 * @summary Update a category
 */
export const useCategoryControllerUpdate = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof categoryControllerUpdate>>,
      TError,
      { id: string; data: UpdateCategoryPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof categoryControllerUpdate>>,
  TError,
  { id: string; data: UpdateCategoryPayloadDto },
  TContext
> => {
  return useMutation(
    getCategoryControllerUpdateMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Delete a category
 */
export type categoryControllerDeleteResponse200 = {
  data: CategoryControllerDelete200
  status: 200
}

export type categoryControllerDeleteResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type categoryControllerDeleteResponseSuccess =
  categoryControllerDeleteResponse200 & {
    headers: Headers
  }
export type categoryControllerDeleteResponseError =
  categoryControllerDeleteResponse401 & {
    headers: Headers
  }

export type categoryControllerDeleteResponse =
  | categoryControllerDeleteResponseSuccess
  | categoryControllerDeleteResponseError

export const getCategoryControllerDeleteUrl = (id: string) => {
  return `/categories/${id}`
}

export const categoryControllerDelete = async (
  id: string,
  options?: RequestInit,
): Promise<categoryControllerDeleteResponse> => {
  return axiosInstance<categoryControllerDeleteResponse>(
    getCategoryControllerDeleteUrl(id),
    {
      ...options,
      method: 'DELETE',
    },
  )
}

export const getCategoryControllerDeleteMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof categoryControllerDelete>>,
    TError,
    { id: string },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof categoryControllerDelete>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationKey = ['categoryControllerDelete']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof categoryControllerDelete>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {}

    return categoryControllerDelete(id, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type CategoryControllerDeleteMutationResult = NonNullable<
  Awaited<ReturnType<typeof categoryControllerDelete>>
>

export type CategoryControllerDeleteMutationError = UnauthorizedDto

/**
 * @summary Delete a category
 */
export const useCategoryControllerDelete = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof categoryControllerDelete>>,
      TError,
      { id: string },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof categoryControllerDelete>>,
  TError,
  { id: string },
  TContext
> => {
  return useMutation(
    getCategoryControllerDeleteMutationOptions(options),
    queryClient,
  )
}
