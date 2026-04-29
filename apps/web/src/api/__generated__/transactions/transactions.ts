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
  CreateTransactionPayloadDto,
  TransactionControllerCreate201,
  TransactionControllerDelete200,
  TransactionControllerDeleteReceipt200,
  TransactionControllerFindAll200,
  TransactionControllerFindAllParams,
  TransactionControllerFindOne200,
  TransactionControllerUpdate200,
  TransactionControllerUploadReceipt200,
  TransactionControllerUploadReceiptBody,
  UnauthorizedDto,
  UpdateTransactionPayloadDto,
} from '../models'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * @summary Get all transactions for the authenticated user
 */
export type transactionControllerFindAllResponse200 = {
  data: TransactionControllerFindAll200
  status: 200
}

export type transactionControllerFindAllResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type transactionControllerFindAllResponseSuccess =
  transactionControllerFindAllResponse200 & {
    headers: Headers
  }
export type transactionControllerFindAllResponseError =
  transactionControllerFindAllResponse401 & {
    headers: Headers
  }

export type transactionControllerFindAllResponse =
  | transactionControllerFindAllResponseSuccess
  | transactionControllerFindAllResponseError

export const getTransactionControllerFindAllUrl = (
  params?: TransactionControllerFindAllParams,
) => {
  const normalizedParams = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }
  })

  const stringifiedParams = normalizedParams.toString()

  return stringifiedParams.length > 0
    ? `/transactions?${stringifiedParams}`
    : `/transactions`
}

export const transactionControllerFindAll = async (
  params?: TransactionControllerFindAllParams,
  options?: RequestInit,
): Promise<transactionControllerFindAllResponse> => {
  return axiosInstance<transactionControllerFindAllResponse>(
    getTransactionControllerFindAllUrl(params),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getTransactionControllerFindAllQueryKey = (
  params?: TransactionControllerFindAllParams,
) => {
  return [`/transactions`, ...(params ? [params] : [])] as const
}

export const getTransactionControllerFindAllQueryOptions = <
  TData = Awaited<ReturnType<typeof transactionControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params?: TransactionControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerFindAll>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof axiosInstance>
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getTransactionControllerFindAllQueryKey(params)

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof transactionControllerFindAll>>
  > = ({ signal }) =>
    transactionControllerFindAll(params, { signal, ...requestOptions })

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof transactionControllerFindAll>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type TransactionControllerFindAllQueryResult = NonNullable<
  Awaited<ReturnType<typeof transactionControllerFindAll>>
>
export type TransactionControllerFindAllQueryError = UnauthorizedDto

export function useTransactionControllerFindAll<
  TData = Awaited<ReturnType<typeof transactionControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params: undefined | TransactionControllerFindAllParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof transactionControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof transactionControllerFindAll>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useTransactionControllerFindAll<
  TData = Awaited<ReturnType<typeof transactionControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params?: TransactionControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerFindAll>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof transactionControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof transactionControllerFindAll>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useTransactionControllerFindAll<
  TData = Awaited<ReturnType<typeof transactionControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params?: TransactionControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerFindAll>>,
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
 * @summary Get all transactions for the authenticated user
 */

export function useTransactionControllerFindAll<
  TData = Awaited<ReturnType<typeof transactionControllerFindAll>>,
  TError = UnauthorizedDto,
>(
  params?: TransactionControllerFindAllParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerFindAll>>,
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
  const queryOptions = getTransactionControllerFindAllQueryOptions(
    params,
    options,
  )

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}

/**
 * @summary Create a transaction
 */
export type transactionControllerCreateResponse201 = {
  data: TransactionControllerCreate201
  status: 201
}

export type transactionControllerCreateResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type transactionControllerCreateResponseSuccess =
  transactionControllerCreateResponse201 & {
    headers: Headers
  }
export type transactionControllerCreateResponseError =
  transactionControllerCreateResponse401 & {
    headers: Headers
  }

export type transactionControllerCreateResponse =
  | transactionControllerCreateResponseSuccess
  | transactionControllerCreateResponseError

export const getTransactionControllerCreateUrl = () => {
  return `/transactions`
}

export const transactionControllerCreate = async (
  createTransactionPayloadDto: CreateTransactionPayloadDto,
  options?: RequestInit,
): Promise<transactionControllerCreateResponse> => {
  return axiosInstance<transactionControllerCreateResponse>(
    getTransactionControllerCreateUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(createTransactionPayloadDto),
    },
  )
}

export const getTransactionControllerCreateMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof transactionControllerCreate>>,
    TError,
    { data: CreateTransactionPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof transactionControllerCreate>>,
  TError,
  { data: CreateTransactionPayloadDto },
  TContext
> => {
  const mutationKey = ['transactionControllerCreate']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof transactionControllerCreate>>,
    { data: CreateTransactionPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return transactionControllerCreate(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type TransactionControllerCreateMutationResult = NonNullable<
  Awaited<ReturnType<typeof transactionControllerCreate>>
>
export type TransactionControllerCreateMutationBody =
  CreateTransactionPayloadDto
export type TransactionControllerCreateMutationError = UnauthorizedDto

/**
 * @summary Create a transaction
 */
export const useTransactionControllerCreate = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof transactionControllerCreate>>,
      TError,
      { data: CreateTransactionPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof transactionControllerCreate>>,
  TError,
  { data: CreateTransactionPayloadDto },
  TContext
> => {
  return useMutation(
    getTransactionControllerCreateMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Get a transaction by id
 */
export type transactionControllerFindOneResponse200 = {
  data: TransactionControllerFindOne200
  status: 200
}

export type transactionControllerFindOneResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type transactionControllerFindOneResponseSuccess =
  transactionControllerFindOneResponse200 & {
    headers: Headers
  }
export type transactionControllerFindOneResponseError =
  transactionControllerFindOneResponse401 & {
    headers: Headers
  }

export type transactionControllerFindOneResponse =
  | transactionControllerFindOneResponseSuccess
  | transactionControllerFindOneResponseError

export const getTransactionControllerFindOneUrl = (id: string) => {
  return `/transactions/${id}`
}

export const transactionControllerFindOne = async (
  id: string,
  options?: RequestInit,
): Promise<transactionControllerFindOneResponse> => {
  return axiosInstance<transactionControllerFindOneResponse>(
    getTransactionControllerFindOneUrl(id),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getTransactionControllerFindOneQueryKey = (id: string) => {
  return [`/transactions/${id}`] as const
}

export const getTransactionControllerFindOneQueryOptions = <
  TData = Awaited<ReturnType<typeof transactionControllerFindOne>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerFindOne>>,
        TError,
        TData
      >
    >
    request?: SecondParameter<typeof axiosInstance>
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey =
    queryOptions?.queryKey ?? getTransactionControllerFindOneQueryKey(id)

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof transactionControllerFindOne>>
  > = ({ signal }) =>
    transactionControllerFindOne(id, { signal, ...requestOptions })

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof transactionControllerFindOne>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type TransactionControllerFindOneQueryResult = NonNullable<
  Awaited<ReturnType<typeof transactionControllerFindOne>>
>
export type TransactionControllerFindOneQueryError = UnauthorizedDto

export function useTransactionControllerFindOne<
  TData = Awaited<ReturnType<typeof transactionControllerFindOne>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerFindOne>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof transactionControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof transactionControllerFindOne>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useTransactionControllerFindOne<
  TData = Awaited<ReturnType<typeof transactionControllerFindOne>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerFindOne>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof transactionControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof transactionControllerFindOne>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useTransactionControllerFindOne<
  TData = Awaited<ReturnType<typeof transactionControllerFindOne>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerFindOne>>,
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
 * @summary Get a transaction by id
 */

export function useTransactionControllerFindOne<
  TData = Awaited<ReturnType<typeof transactionControllerFindOne>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerFindOne>>,
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
  const queryOptions = getTransactionControllerFindOneQueryOptions(id, options)

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}

/**
 * @summary Update a transaction
 */
export type transactionControllerUpdateResponse200 = {
  data: TransactionControllerUpdate200
  status: 200
}

export type transactionControllerUpdateResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type transactionControllerUpdateResponseSuccess =
  transactionControllerUpdateResponse200 & {
    headers: Headers
  }
export type transactionControllerUpdateResponseError =
  transactionControllerUpdateResponse401 & {
    headers: Headers
  }

export type transactionControllerUpdateResponse =
  | transactionControllerUpdateResponseSuccess
  | transactionControllerUpdateResponseError

export const getTransactionControllerUpdateUrl = (id: string) => {
  return `/transactions/${id}`
}

export const transactionControllerUpdate = async (
  id: string,
  updateTransactionPayloadDto: UpdateTransactionPayloadDto,
  options?: RequestInit,
): Promise<transactionControllerUpdateResponse> => {
  return axiosInstance<transactionControllerUpdateResponse>(
    getTransactionControllerUpdateUrl(id),
    {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(updateTransactionPayloadDto),
    },
  )
}

export const getTransactionControllerUpdateMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof transactionControllerUpdate>>,
    TError,
    { id: string; data: UpdateTransactionPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof transactionControllerUpdate>>,
  TError,
  { id: string; data: UpdateTransactionPayloadDto },
  TContext
> => {
  const mutationKey = ['transactionControllerUpdate']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof transactionControllerUpdate>>,
    { id: string; data: UpdateTransactionPayloadDto }
  > = (props) => {
    const { id, data } = props ?? {}

    return transactionControllerUpdate(id, data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type TransactionControllerUpdateMutationResult = NonNullable<
  Awaited<ReturnType<typeof transactionControllerUpdate>>
>
export type TransactionControllerUpdateMutationBody =
  UpdateTransactionPayloadDto
export type TransactionControllerUpdateMutationError = UnauthorizedDto

/**
 * @summary Update a transaction
 */
export const useTransactionControllerUpdate = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof transactionControllerUpdate>>,
      TError,
      { id: string; data: UpdateTransactionPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof transactionControllerUpdate>>,
  TError,
  { id: string; data: UpdateTransactionPayloadDto },
  TContext
> => {
  return useMutation(
    getTransactionControllerUpdateMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Delete a transaction
 */
export type transactionControllerDeleteResponse200 = {
  data: TransactionControllerDelete200
  status: 200
}

export type transactionControllerDeleteResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type transactionControllerDeleteResponseSuccess =
  transactionControllerDeleteResponse200 & {
    headers: Headers
  }
export type transactionControllerDeleteResponseError =
  transactionControllerDeleteResponse401 & {
    headers: Headers
  }

export type transactionControllerDeleteResponse =
  | transactionControllerDeleteResponseSuccess
  | transactionControllerDeleteResponseError

export const getTransactionControllerDeleteUrl = (id: string) => {
  return `/transactions/${id}`
}

export const transactionControllerDelete = async (
  id: string,
  options?: RequestInit,
): Promise<transactionControllerDeleteResponse> => {
  return axiosInstance<transactionControllerDeleteResponse>(
    getTransactionControllerDeleteUrl(id),
    {
      ...options,
      method: 'DELETE',
    },
  )
}

export const getTransactionControllerDeleteMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof transactionControllerDelete>>,
    TError,
    { id: string },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof transactionControllerDelete>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationKey = ['transactionControllerDelete']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof transactionControllerDelete>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {}

    return transactionControllerDelete(id, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type TransactionControllerDeleteMutationResult = NonNullable<
  Awaited<ReturnType<typeof transactionControllerDelete>>
>

export type TransactionControllerDeleteMutationError = UnauthorizedDto

/**
 * @summary Delete a transaction
 */
export const useTransactionControllerDelete = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof transactionControllerDelete>>,
      TError,
      { id: string },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof transactionControllerDelete>>,
  TError,
  { id: string },
  TContext
> => {
  return useMutation(
    getTransactionControllerDeleteMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Upload receipt for a transaction
 */
export type transactionControllerUploadReceiptResponse200 = {
  data: TransactionControllerUploadReceipt200
  status: 200
}

export type transactionControllerUploadReceiptResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type transactionControllerUploadReceiptResponseSuccess =
  transactionControllerUploadReceiptResponse200 & {
    headers: Headers
  }
export type transactionControllerUploadReceiptResponseError =
  transactionControllerUploadReceiptResponse401 & {
    headers: Headers
  }

export type transactionControllerUploadReceiptResponse =
  | transactionControllerUploadReceiptResponseSuccess
  | transactionControllerUploadReceiptResponseError

export const getTransactionControllerUploadReceiptUrl = (id: string) => {
  return `/transactions/${id}/receipt`
}

export const transactionControllerUploadReceipt = async (
  id: string,
  transactionControllerUploadReceiptBody: TransactionControllerUploadReceiptBody,
  options?: RequestInit,
): Promise<transactionControllerUploadReceiptResponse> => {
  const formData = new FormData()
  if (transactionControllerUploadReceiptBody.file !== undefined) {
    formData.append(`file`, transactionControllerUploadReceiptBody.file)
  }

  return axiosInstance<transactionControllerUploadReceiptResponse>(
    getTransactionControllerUploadReceiptUrl(id),
    {
      ...options,
      method: 'POST',
      body: formData,
    },
  )
}

export const getTransactionControllerUploadReceiptMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof transactionControllerUploadReceipt>>,
    TError,
    { id: string; data: TransactionControllerUploadReceiptBody },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof transactionControllerUploadReceipt>>,
  TError,
  { id: string; data: TransactionControllerUploadReceiptBody },
  TContext
> => {
  const mutationKey = ['transactionControllerUploadReceipt']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof transactionControllerUploadReceipt>>,
    { id: string; data: TransactionControllerUploadReceiptBody }
  > = (props) => {
    const { id, data } = props ?? {}

    return transactionControllerUploadReceipt(id, data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type TransactionControllerUploadReceiptMutationResult = NonNullable<
  Awaited<ReturnType<typeof transactionControllerUploadReceipt>>
>
export type TransactionControllerUploadReceiptMutationBody =
  TransactionControllerUploadReceiptBody
export type TransactionControllerUploadReceiptMutationError = UnauthorizedDto

/**
 * @summary Upload receipt for a transaction
 */
export const useTransactionControllerUploadReceipt = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof transactionControllerUploadReceipt>>,
      TError,
      { id: string; data: TransactionControllerUploadReceiptBody },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof transactionControllerUploadReceipt>>,
  TError,
  { id: string; data: TransactionControllerUploadReceiptBody },
  TContext
> => {
  return useMutation(
    getTransactionControllerUploadReceiptMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Delete receipt for a transaction
 */
export type transactionControllerDeleteReceiptResponse200 = {
  data: TransactionControllerDeleteReceipt200
  status: 200
}

export type transactionControllerDeleteReceiptResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type transactionControllerDeleteReceiptResponseSuccess =
  transactionControllerDeleteReceiptResponse200 & {
    headers: Headers
  }
export type transactionControllerDeleteReceiptResponseError =
  transactionControllerDeleteReceiptResponse401 & {
    headers: Headers
  }

export type transactionControllerDeleteReceiptResponse =
  | transactionControllerDeleteReceiptResponseSuccess
  | transactionControllerDeleteReceiptResponseError

export const getTransactionControllerDeleteReceiptUrl = (id: string) => {
  return `/transactions/${id}/receipt`
}

export const transactionControllerDeleteReceipt = async (
  id: string,
  options?: RequestInit,
): Promise<transactionControllerDeleteReceiptResponse> => {
  return axiosInstance<transactionControllerDeleteReceiptResponse>(
    getTransactionControllerDeleteReceiptUrl(id),
    {
      ...options,
      method: 'DELETE',
    },
  )
}

export const getTransactionControllerDeleteReceiptMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof transactionControllerDeleteReceipt>>,
    TError,
    { id: string },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof transactionControllerDeleteReceipt>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationKey = ['transactionControllerDeleteReceipt']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof transactionControllerDeleteReceipt>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {}

    return transactionControllerDeleteReceipt(id, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type TransactionControllerDeleteReceiptMutationResult = NonNullable<
  Awaited<ReturnType<typeof transactionControllerDeleteReceipt>>
>

export type TransactionControllerDeleteReceiptMutationError = UnauthorizedDto

/**
 * @summary Delete receipt for a transaction
 */
export const useTransactionControllerDeleteReceipt = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof transactionControllerDeleteReceipt>>,
      TError,
      { id: string },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof transactionControllerDeleteReceipt>>,
  TError,
  { id: string },
  TContext
> => {
  return useMutation(
    getTransactionControllerDeleteReceiptMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Download receipt for a transaction
 */
export type transactionControllerDownloadReceiptResponse401 = {
  data: UnauthorizedDto
  status: 401
}
export type transactionControllerDownloadReceiptResponseError =
  transactionControllerDownloadReceiptResponse401 & {
    headers: Headers
  }

export type transactionControllerDownloadReceiptResponse =
  transactionControllerDownloadReceiptResponseError

export const getTransactionControllerDownloadReceiptUrl = (id: string) => {
  return `/transactions/${id}/receipt`
}

export const transactionControllerDownloadReceipt = async (
  id: string,
  options?: RequestInit,
): Promise<transactionControllerDownloadReceiptResponse> => {
  return axiosInstance<transactionControllerDownloadReceiptResponse>(
    getTransactionControllerDownloadReceiptUrl(id),
    {
      ...options,
      method: 'GET',
    },
  )
}

export const getTransactionControllerDownloadReceiptQueryKey = (id: string) => {
  return [`/transactions/${id}/receipt`] as const
}

export const getTransactionControllerDownloadReceiptQueryOptions = <
  TData = Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
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
    getTransactionControllerDownloadReceiptQueryKey(id)

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>
  > = ({ signal }) =>
    transactionControllerDownloadReceipt(id, { signal, ...requestOptions })

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type TransactionControllerDownloadReceiptQueryResult = NonNullable<
  Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>
>
export type TransactionControllerDownloadReceiptQueryError = UnauthorizedDto

export function useTransactionControllerDownloadReceipt<
  TData = Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
          TError,
          Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useTransactionControllerDownloadReceipt<
  TData = Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
          TError,
          Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>
        >,
        'initialData'
      >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>
}
export function useTransactionControllerDownloadReceipt<
  TData = Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
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
 * @summary Download receipt for a transaction
 */

export function useTransactionControllerDownloadReceipt<
  TData = Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
  TError = UnauthorizedDto,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof transactionControllerDownloadReceipt>>,
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
  const queryOptions = getTransactionControllerDownloadReceiptQueryOptions(
    id,
    options,
  )

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> }

  return { ...query, queryKey: queryOptions.queryKey }
}
