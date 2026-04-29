export interface ResetPasswordPayloadDto {
  token: string
  email: string
  /**
   * @minLength 8
   * @maxLength 30
   */
  password: string
  /**
   * @minLength 8
   * @maxLength 30
   */
  passwordConfirmation: string
}
