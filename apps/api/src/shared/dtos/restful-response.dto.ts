import { ApiProperty } from '@nestjs/swagger'

export class RestfulResponseDto<T> {
  @ApiProperty()
  readonly message: string

  @ApiProperty()
  readonly data: T

  constructor(data: RestfulResponseDto<T>) {
    Object.assign(this, data)
  }
}
