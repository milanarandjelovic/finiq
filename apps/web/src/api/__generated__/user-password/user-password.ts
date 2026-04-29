import { useMutation } from '@tanstack/react-query'
import type {
  MutationFunction,
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query'

import { axiosInstance } from '../../axios-instance'
import type {
  UserPasswordControllerUpdate200,
  UserPasswordControllerUpdate400,
  UserPasswordPayloadDto,
  UserUnauthorizedDto,
} from '../models'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * @summary Update a user password
 */
export type userPasswordControllerUpdateResponse200 = {
  data: UserPasswordControllerUpdate200
  status: 200
}

export type userPasswordControllerUpdateResponse400 = {
  data: UserPasswordControllerUpdate400
  status: 400
}

export type userPasswordControllerUpdateResponse401 = {
  data: UserUnauthorizedDto
  status: 401
}

export type userPasswordControllerUpdateResponseSuccess =
  userPasswordControllerUpdateResponse200 & {
    headers: Headers
  }
export type userPasswordControllerUpdateResponseError = (
  | userPasswordControllerUpdateResponse400
  | userPasswordControllerUpdateResponse401
) & {
  headers: Headers
}

export type userPasswordControllerUpdateResponse =
  | userPasswordControllerUpdateResponseSuccess
  | userPasswordControllerUpdateResponseError

export const getUserPasswordControllerUpdateUrl = () => {
  return `/user/password`
}

export const userPasswordControllerUpdate = async (
  userPasswordPayloadDto: UserPasswordPayloadDto,
  options?: RequestInit,
): Promise<userPasswordControllerUpdateResponse> => {
  return axiosInstance<userPasswordControllerUpdateResponse>(
    getUserPasswordControllerUpdateUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(userPasswordPayloadDto),
    },
  )
}

export const getUserPasswordControllerUpdateMutationOptions = <
  TError = UserPasswordControllerUpdate400 | UserUnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userPasswordControllerUpdate>>,
    TError,
    { data: UserPasswordPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof userPasswordControllerUpdate>>,
  TError,
  { data: UserPasswordPayloadDto },
  TContext
> => {
  const mutationKey = ['userPasswordControllerUpdate']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof userPasswordControllerUpdate>>,
    { data: UserPasswordPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return userPasswordControllerUpdate(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type UserPasswordControllerUpdateMutationResult = NonNullable<
  Awaited<ReturnType<typeof userPasswordControllerUpdate>>
>
export type UserPasswordControllerUpdateMutationBody = UserPasswordPayloadDto
export type UserPasswordControllerUpdateMutationError =
  | UserPasswordControllerUpdate400
  | UserUnauthorizedDto

/**
 * @summary Update a user password
 */
export const useUserPasswordControllerUpdate = <
  TError = UserPasswordControllerUpdate400 | UserUnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof userPasswordControllerUpdate>>,
      TError,
      { data: UserPasswordPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof userPasswordControllerUpdate>>,
  TError,
  { data: UserPasswordPayloadDto },
  TContext
> => {
  return useMutation(
    getUserPasswordControllerUpdateMutationOptions(options),
    queryClient,
  )
}
