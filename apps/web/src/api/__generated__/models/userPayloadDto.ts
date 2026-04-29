export interface UserPayloadDto {
  /**
   * @minLength 3
   * @maxLength 30
   */
  name: string
  email: string
  /** When true, creates user without a password and sends an activation email */
  sendActivationEmail?: boolean
  /**
   * @minLength 8
   * @maxLength 30
   */
  password?: string
  /**
   * @minLength 8
   * @maxLength 30
   */
  passwordConfirmation?: string
}
