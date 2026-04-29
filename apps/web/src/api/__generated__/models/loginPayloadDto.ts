export interface LoginPayloadDto {
  email: string
  /**
   * @minLength 8
   * @maxLength 30
   */
  password: string
}
