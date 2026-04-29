export interface RegisterPayloadDto {
  /**
   * @minLength 3
   * @maxLength 30
   */
  name: string
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
