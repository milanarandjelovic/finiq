import { useMutation } from '@tanstack/react-query'
import type {
  MutationFunction,
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query'

import { axiosInstance } from '../../axios-instance'
import type {
  AuthControllerForgotPassword200,
  AuthControllerForgotPassword400,
  AuthControllerLogin200,
  AuthControllerLogin400,
  AuthControllerLogout200,
  AuthControllerRefreshAccessToken200,
  AuthControllerRegister200,
  AuthControllerRegister400,
  AuthControllerResendEmailVerification200,
  AuthControllerResendEmailVerification400,
  AuthControllerResetPassword200,
  AuthControllerResetPassword400,
  AuthControllerVerifyEmail200,
  AuthControllerVerifyEmail400,
  ForgotPasswordPayloadDto,
  LoginPayloadDto,
  RefreshAccessTokenNotFoundDto,
  RefreshAccessTokenPayloadDto,
  RefreshAccessTokenUnauthorizedDto,
  RegisterPayloadDto,
  ResendEmailVerificationPayloadDto,
  ResetPasswordPayloadDto,
  UnauthorizedDto,
  VerifyEmailPayloadDto,
} from '../models'

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1]

/**
 * @summary Register
 */
export type authControllerRegisterResponse200 = {
  data: AuthControllerRegister200
  status: 200
}

export type authControllerRegisterResponse400 = {
  data: AuthControllerRegister400
  status: 400
}

export type authControllerRegisterResponseSuccess =
  authControllerRegisterResponse200 & {
    headers: Headers
  }
export type authControllerRegisterResponseError =
  authControllerRegisterResponse400 & {
    headers: Headers
  }

export type authControllerRegisterResponse =
  | authControllerRegisterResponseSuccess
  | authControllerRegisterResponseError

export const getAuthControllerRegisterUrl = () => {
  return `/auth/register`
}

export const authControllerRegister = async (
  registerPayloadDto: RegisterPayloadDto,
  options?: RequestInit,
): Promise<authControllerRegisterResponse> => {
  return axiosInstance<authControllerRegisterResponse>(
    getAuthControllerRegisterUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(registerPayloadDto),
    },
  )
}

export const getAuthControllerRegisterMutationOptions = <
  TError = AuthControllerRegister400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authControllerRegister>>,
    TError,
    { data: RegisterPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof authControllerRegister>>,
  TError,
  { data: RegisterPayloadDto },
  TContext
> => {
  const mutationKey = ['authControllerRegister']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof authControllerRegister>>,
    { data: RegisterPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return authControllerRegister(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type AuthControllerRegisterMutationResult = NonNullable<
  Awaited<ReturnType<typeof authControllerRegister>>
>
export type AuthControllerRegisterMutationBody = RegisterPayloadDto
export type AuthControllerRegisterMutationError = AuthControllerRegister400

/**
 * @summary Register
 */
export const useAuthControllerRegister = <
  TError = AuthControllerRegister400,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof authControllerRegister>>,
      TError,
      { data: RegisterPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof authControllerRegister>>,
  TError,
  { data: RegisterPayloadDto },
  TContext
> => {
  return useMutation(
    getAuthControllerRegisterMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Login
 */
export type authControllerLoginResponse200 = {
  data: AuthControllerLogin200
  status: 200
}

export type authControllerLoginResponse400 = {
  data: AuthControllerLogin400
  status: 400
}

export type authControllerLoginResponseSuccess =
  authControllerLoginResponse200 & {
    headers: Headers
  }
export type authControllerLoginResponseError =
  authControllerLoginResponse400 & {
    headers: Headers
  }

export type authControllerLoginResponse =
  | authControllerLoginResponseSuccess
  | authControllerLoginResponseError

export const getAuthControllerLoginUrl = () => {
  return `/auth/login`
}

export const authControllerLogin = async (
  loginPayloadDto: LoginPayloadDto,
  options?: RequestInit,
): Promise<authControllerLoginResponse> => {
  return axiosInstance<authControllerLoginResponse>(
    getAuthControllerLoginUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(loginPayloadDto),
    },
  )
}

export const getAuthControllerLoginMutationOptions = <
  TError = AuthControllerLogin400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authControllerLogin>>,
    TError,
    { data: LoginPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof authControllerLogin>>,
  TError,
  { data: LoginPayloadDto },
  TContext
> => {
  const mutationKey = ['authControllerLogin']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof authControllerLogin>>,
    { data: LoginPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return authControllerLogin(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type AuthControllerLoginMutationResult = NonNullable<
  Awaited<ReturnType<typeof authControllerLogin>>
>
export type AuthControllerLoginMutationBody = LoginPayloadDto
export type AuthControllerLoginMutationError = AuthControllerLogin400

/**
 * @summary Login
 */
export const useAuthControllerLogin = <
  TError = AuthControllerLogin400,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof authControllerLogin>>,
      TError,
      { data: LoginPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof authControllerLogin>>,
  TError,
  { data: LoginPayloadDto },
  TContext
> => {
  return useMutation(
    getAuthControllerLoginMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Logout
 */
export type authControllerLogoutResponse200 = {
  data: AuthControllerLogout200
  status: 200
}

export type authControllerLogoutResponse401 = {
  data: UnauthorizedDto
  status: 401
}

export type authControllerLogoutResponseSuccess =
  authControllerLogoutResponse200 & {
    headers: Headers
  }
export type authControllerLogoutResponseError =
  authControllerLogoutResponse401 & {
    headers: Headers
  }

export type authControllerLogoutResponse =
  | authControllerLogoutResponseSuccess
  | authControllerLogoutResponseError

export const getAuthControllerLogoutUrl = () => {
  return `/auth/logout`
}

export const authControllerLogout = async (
  options?: RequestInit,
): Promise<authControllerLogoutResponse> => {
  return axiosInstance<authControllerLogoutResponse>(
    getAuthControllerLogoutUrl(),
    {
      ...options,
      method: 'POST',
    },
  )
}

export const getAuthControllerLogoutMutationOptions = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authControllerLogout>>,
    TError,
    void,
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof authControllerLogout>>,
  TError,
  void,
  TContext
> => {
  const mutationKey = ['authControllerLogout']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof authControllerLogout>>,
    void
  > = () => {
    return authControllerLogout(requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type AuthControllerLogoutMutationResult = NonNullable<
  Awaited<ReturnType<typeof authControllerLogout>>
>

export type AuthControllerLogoutMutationError = UnauthorizedDto

/**
 * @summary Logout
 */
export const useAuthControllerLogout = <
  TError = UnauthorizedDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof authControllerLogout>>,
      TError,
      void,
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof authControllerLogout>>,
  TError,
  void,
  TContext
> => {
  return useMutation(
    getAuthControllerLogoutMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Forgot Password
 */
export type authControllerForgotPasswordResponse200 = {
  data: AuthControllerForgotPassword200
  status: 200
}

export type authControllerForgotPasswordResponse400 = {
  data: AuthControllerForgotPassword400
  status: 400
}

export type authControllerForgotPasswordResponseSuccess =
  authControllerForgotPasswordResponse200 & {
    headers: Headers
  }
export type authControllerForgotPasswordResponseError =
  authControllerForgotPasswordResponse400 & {
    headers: Headers
  }

export type authControllerForgotPasswordResponse =
  | authControllerForgotPasswordResponseSuccess
  | authControllerForgotPasswordResponseError

export const getAuthControllerForgotPasswordUrl = () => {
  return `/auth/forgot-password`
}

export const authControllerForgotPassword = async (
  forgotPasswordPayloadDto: ForgotPasswordPayloadDto,
  options?: RequestInit,
): Promise<authControllerForgotPasswordResponse> => {
  return axiosInstance<authControllerForgotPasswordResponse>(
    getAuthControllerForgotPasswordUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(forgotPasswordPayloadDto),
    },
  )
}

export const getAuthControllerForgotPasswordMutationOptions = <
  TError = AuthControllerForgotPassword400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authControllerForgotPassword>>,
    TError,
    { data: ForgotPasswordPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof authControllerForgotPassword>>,
  TError,
  { data: ForgotPasswordPayloadDto },
  TContext
> => {
  const mutationKey = ['authControllerForgotPassword']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof authControllerForgotPassword>>,
    { data: ForgotPasswordPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return authControllerForgotPassword(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type AuthControllerForgotPasswordMutationResult = NonNullable<
  Awaited<ReturnType<typeof authControllerForgotPassword>>
>
export type AuthControllerForgotPasswordMutationBody = ForgotPasswordPayloadDto
export type AuthControllerForgotPasswordMutationError =
  AuthControllerForgotPassword400

/**
 * @summary Forgot Password
 */
export const useAuthControllerForgotPassword = <
  TError = AuthControllerForgotPassword400,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof authControllerForgotPassword>>,
      TError,
      { data: ForgotPasswordPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof authControllerForgotPassword>>,
  TError,
  { data: ForgotPasswordPayloadDto },
  TContext
> => {
  return useMutation(
    getAuthControllerForgotPasswordMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Reset Password
 */
export type authControllerResetPasswordResponse200 = {
  data: AuthControllerResetPassword200
  status: 200
}

export type authControllerResetPasswordResponse400 = {
  data: AuthControllerResetPassword400
  status: 400
}

export type authControllerResetPasswordResponseSuccess =
  authControllerResetPasswordResponse200 & {
    headers: Headers
  }
export type authControllerResetPasswordResponseError =
  authControllerResetPasswordResponse400 & {
    headers: Headers
  }

export type authControllerResetPasswordResponse =
  | authControllerResetPasswordResponseSuccess
  | authControllerResetPasswordResponseError

export const getAuthControllerResetPasswordUrl = () => {
  return `/auth/reset-password`
}

export const authControllerResetPassword = async (
  resetPasswordPayloadDto: ResetPasswordPayloadDto,
  options?: RequestInit,
): Promise<authControllerResetPasswordResponse> => {
  return axiosInstance<authControllerResetPasswordResponse>(
    getAuthControllerResetPasswordUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(resetPasswordPayloadDto),
    },
  )
}

export const getAuthControllerResetPasswordMutationOptions = <
  TError = AuthControllerResetPassword400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authControllerResetPassword>>,
    TError,
    { data: ResetPasswordPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof authControllerResetPassword>>,
  TError,
  { data: ResetPasswordPayloadDto },
  TContext
> => {
  const mutationKey = ['authControllerResetPassword']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof authControllerResetPassword>>,
    { data: ResetPasswordPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return authControllerResetPassword(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type AuthControllerResetPasswordMutationResult = NonNullable<
  Awaited<ReturnType<typeof authControllerResetPassword>>
>
export type AuthControllerResetPasswordMutationBody = ResetPasswordPayloadDto
export type AuthControllerResetPasswordMutationError =
  AuthControllerResetPassword400

/**
 * @summary Reset Password
 */
export const useAuthControllerResetPassword = <
  TError = AuthControllerResetPassword400,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof authControllerResetPassword>>,
      TError,
      { data: ResetPasswordPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof authControllerResetPassword>>,
  TError,
  { data: ResetPasswordPayloadDto },
  TContext
> => {
  return useMutation(
    getAuthControllerResetPasswordMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Resend Email Verification
 */
export type authControllerResendEmailVerificationResponse200 = {
  data: AuthControllerResendEmailVerification200
  status: 200
}

export type authControllerResendEmailVerificationResponse400 = {
  data: AuthControllerResendEmailVerification400
  status: 400
}

export type authControllerResendEmailVerificationResponseSuccess =
  authControllerResendEmailVerificationResponse200 & {
    headers: Headers
  }
export type authControllerResendEmailVerificationResponseError =
  authControllerResendEmailVerificationResponse400 & {
    headers: Headers
  }

export type authControllerResendEmailVerificationResponse =
  | authControllerResendEmailVerificationResponseSuccess
  | authControllerResendEmailVerificationResponseError

export const getAuthControllerResendEmailVerificationUrl = () => {
  return `/auth/resend-email-verification`
}

export const authControllerResendEmailVerification = async (
  resendEmailVerificationPayloadDto: ResendEmailVerificationPayloadDto,
  options?: RequestInit,
): Promise<authControllerResendEmailVerificationResponse> => {
  return axiosInstance<authControllerResendEmailVerificationResponse>(
    getAuthControllerResendEmailVerificationUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(resendEmailVerificationPayloadDto),
    },
  )
}

export const getAuthControllerResendEmailVerificationMutationOptions = <
  TError = AuthControllerResendEmailVerification400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authControllerResendEmailVerification>>,
    TError,
    { data: ResendEmailVerificationPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof authControllerResendEmailVerification>>,
  TError,
  { data: ResendEmailVerificationPayloadDto },
  TContext
> => {
  const mutationKey = ['authControllerResendEmailVerification']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof authControllerResendEmailVerification>>,
    { data: ResendEmailVerificationPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return authControllerResendEmailVerification(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type AuthControllerResendEmailVerificationMutationResult = NonNullable<
  Awaited<ReturnType<typeof authControllerResendEmailVerification>>
>
export type AuthControllerResendEmailVerificationMutationBody =
  ResendEmailVerificationPayloadDto
export type AuthControllerResendEmailVerificationMutationError =
  AuthControllerResendEmailVerification400

/**
 * @summary Resend Email Verification
 */
export const useAuthControllerResendEmailVerification = <
  TError = AuthControllerResendEmailVerification400,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof authControllerResendEmailVerification>>,
      TError,
      { data: ResendEmailVerificationPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof authControllerResendEmailVerification>>,
  TError,
  { data: ResendEmailVerificationPayloadDto },
  TContext
> => {
  return useMutation(
    getAuthControllerResendEmailVerificationMutationOptions(options),
    queryClient,
  )
}
/**
 * Verifies the email token and activates the account. On success, an account activation confirmation email is sent to the user.
 * @summary Verify Email
 */
export type authControllerVerifyEmailResponse200 = {
  data: AuthControllerVerifyEmail200
  status: 200
}

export type authControllerVerifyEmailResponse400 = {
  data: AuthControllerVerifyEmail400
  status: 400
}

export type authControllerVerifyEmailResponseSuccess =
  authControllerVerifyEmailResponse200 & {
    headers: Headers
  }
export type authControllerVerifyEmailResponseError =
  authControllerVerifyEmailResponse400 & {
    headers: Headers
  }

export type authControllerVerifyEmailResponse =
  | authControllerVerifyEmailResponseSuccess
  | authControllerVerifyEmailResponseError

export const getAuthControllerVerifyEmailUrl = () => {
  return `/auth/verify-email`
}

export const authControllerVerifyEmail = async (
  verifyEmailPayloadDto: VerifyEmailPayloadDto,
  options?: RequestInit,
): Promise<authControllerVerifyEmailResponse> => {
  return axiosInstance<authControllerVerifyEmailResponse>(
    getAuthControllerVerifyEmailUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(verifyEmailPayloadDto),
    },
  )
}

export const getAuthControllerVerifyEmailMutationOptions = <
  TError = AuthControllerVerifyEmail400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authControllerVerifyEmail>>,
    TError,
    { data: VerifyEmailPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof authControllerVerifyEmail>>,
  TError,
  { data: VerifyEmailPayloadDto },
  TContext
> => {
  const mutationKey = ['authControllerVerifyEmail']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof authControllerVerifyEmail>>,
    { data: VerifyEmailPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return authControllerVerifyEmail(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type AuthControllerVerifyEmailMutationResult = NonNullable<
  Awaited<ReturnType<typeof authControllerVerifyEmail>>
>
export type AuthControllerVerifyEmailMutationBody = VerifyEmailPayloadDto
export type AuthControllerVerifyEmailMutationError =
  AuthControllerVerifyEmail400

/**
 * @summary Verify Email
 */
export const useAuthControllerVerifyEmail = <
  TError = AuthControllerVerifyEmail400,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof authControllerVerifyEmail>>,
      TError,
      { data: VerifyEmailPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof authControllerVerifyEmail>>,
  TError,
  { data: VerifyEmailPayloadDto },
  TContext
> => {
  return useMutation(
    getAuthControllerVerifyEmailMutationOptions(options),
    queryClient,
  )
}
/**
 * @summary Refresh Access Token
 */
export type authControllerRefreshAccessTokenResponse200 = {
  data: AuthControllerRefreshAccessToken200
  status: 200
}

export type authControllerRefreshAccessTokenResponse401 = {
  data: RefreshAccessTokenUnauthorizedDto
  status: 401
}

export type authControllerRefreshAccessTokenResponse404 = {
  data: RefreshAccessTokenNotFoundDto
  status: 404
}

export type authControllerRefreshAccessTokenResponseSuccess =
  authControllerRefreshAccessTokenResponse200 & {
    headers: Headers
  }
export type authControllerRefreshAccessTokenResponseError = (
  | authControllerRefreshAccessTokenResponse401
  | authControllerRefreshAccessTokenResponse404
) & {
  headers: Headers
}

export type authControllerRefreshAccessTokenResponse =
  | authControllerRefreshAccessTokenResponseSuccess
  | authControllerRefreshAccessTokenResponseError

export const getAuthControllerRefreshAccessTokenUrl = () => {
  return `/auth/refresh-access-token`
}

export const authControllerRefreshAccessToken = async (
  refreshAccessTokenPayloadDto: RefreshAccessTokenPayloadDto,
  options?: RequestInit,
): Promise<authControllerRefreshAccessTokenResponse> => {
  return axiosInstance<authControllerRefreshAccessTokenResponse>(
    getAuthControllerRefreshAccessTokenUrl(),
    {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(refreshAccessTokenPayloadDto),
    },
  )
}

export const getAuthControllerRefreshAccessTokenMutationOptions = <
  TError = RefreshAccessTokenUnauthorizedDto | RefreshAccessTokenNotFoundDto,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authControllerRefreshAccessToken>>,
    TError,
    { data: RefreshAccessTokenPayloadDto },
    TContext
  >
  request?: SecondParameter<typeof axiosInstance>
}): UseMutationOptions<
  Awaited<ReturnType<typeof authControllerRefreshAccessToken>>,
  TError,
  { data: RefreshAccessTokenPayloadDto },
  TContext
> => {
  const mutationKey = ['authControllerRefreshAccessToken']
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      'mutationKey' in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined }

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof authControllerRefreshAccessToken>>,
    { data: RefreshAccessTokenPayloadDto }
  > = (props) => {
    const { data } = props ?? {}

    return authControllerRefreshAccessToken(data, requestOptions)
  }

  return { mutationFn, ...mutationOptions }
}

export type AuthControllerRefreshAccessTokenMutationResult = NonNullable<
  Awaited<ReturnType<typeof authControllerRefreshAccessToken>>
>
export type AuthControllerRefreshAccessTokenMutationBody =
  RefreshAccessTokenPayloadDto
export type AuthControllerRefreshAccessTokenMutationError =
  | RefreshAccessTokenUnauthorizedDto
  | RefreshAccessTokenNotFoundDto

/**
 * @summary Refresh Access Token
 */
export const useAuthControllerRefreshAccessToken = <
  TError = RefreshAccessTokenUnauthorizedDto | RefreshAccessTokenNotFoundDto,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof authControllerRefreshAccessToken>>,
      TError,
      { data: RefreshAccessTokenPayloadDto },
      TContext
    >
    request?: SecondParameter<typeof axiosInstance>
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof authControllerRefreshAccessToken>>,
  TError,
  { data: RefreshAccessTokenPayloadDto },
  TContext
> => {
  return useMutation(
    getAuthControllerRefreshAccessTokenMutationOptions(options),
    queryClient,
  )
}
