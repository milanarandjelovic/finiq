export interface UserPasswordPayloadDto {
  /**
   * @minLength 8
   * @maxLength 30
   */
  password: string
  /**
   * @minLength 8
   * @maxLength 30
   */
  newPassword: string
  /**
   * @minLength 8
   * @maxLength 30
   */
  passwordConfirmation: string
}
