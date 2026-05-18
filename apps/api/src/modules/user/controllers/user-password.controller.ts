import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Request } from 'express'

import { TransformInterceptor } from '@/interceptors/transform.interceptor'
import { JwtAuthenticationGuard } from '@/modules/auth/guards/jwt-authentication.guard'
import { UserNewPasswordLowercaseDto } from '@/modules/user/dtos/new-password/user-new-password-lowercase.dto'
import { UserNewPasswordMaxLengthDto } from '@/modules/user/dtos/new-password/user-new-password-max-length.dto'
import { UserNewPasswordMinLengthDto } from '@/modules/user/dtos/new-password/user-new-password-min-length.dto'
import { UserNewPasswordNumberDto } from '@/modules/user/dtos/new-password/user-new-password-number.dto'
import { UserNewPasswordUppercaseDto } from '@/modules/user/dtos/new-password/user-new-password-uppercase.dto'
import { UserPasswordConfirmationLowercaseDto } from '@/modules/user/dtos/password-confirmation/user-password-confirmation-lowercase.dto'
import { UserPasswordConfirmationMaxLengthDto } from '@/modules/user/dtos/password-confirmation/user-password-confirmation-max-length.dto'
import { UserPasswordConfirmationMinLengthDto } from '@/modules/user/dtos/password-confirmation/user-password-confirmation-min-lenght.dto'
import { UserPasswordConfirmationNumberDto } from '@/modules/user/dtos/password-confirmation/user-password-confirmation-number.dto'
import { UserPasswordConfirmationUppercaseDto } from '@/modules/user/dtos/password-confirmation/user-password-confirmation-uppercase.dto'
import { UserPasswordLowercaseDto } from '@/modules/user/dtos/password/user-password-lowercase.dto'
import { UserPasswordMaxLengthDto } from '@/modules/user/dtos/password/user-password-max-length.dto'
import { UserPasswordMinLengthDto } from '@/modules/user/dtos/password/user-password-min-length.dto'
import { UserPasswordNumberDto } from '@/modules/user/dtos/password/user-password-number.dto'
import { UserPasswordPayloadDto } from '@/modules/user/dtos/password/user-password-payload.dto'
import { UserPasswordUppercaseDto } from '@/modules/user/dtos/password/user-password-uppercase.dto'
import { UserNotFoundDto } from '@/modules/user/dtos/user-not-found.dto'
import { UserResponseDto } from '@/modules/user/dtos/user-response.dto'
import { UserUnauthorizedDto } from '@/modules/user/dtos/user-unauthorized.dto'
import { UserPasswordService } from '@/modules/user/services/user-password.service'
import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@Controller('user/password')
@ApiTags('User Password')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('JwtToken')
@UseGuards(JwtAuthenticationGuard)
export class UserPasswordController {
  constructor(private readonly userProfileService: UserPasswordService) {}

  @Post()
  @ApiOperation({ summary: 'Update a user password' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    model: UserResponseDto,
    status: HttpStatus.OK,
    description: 'Successfully return user',
  })
  @ApiRestfulResponse({
    model: [
      UserNotFoundDto,
      UserPasswordMinLengthDto,
      UserPasswordMaxLengthDto,
      UserPasswordLowercaseDto,
      UserPasswordUppercaseDto,
      UserPasswordNumberDto,
      UserNewPasswordMinLengthDto,
      UserNewPasswordMaxLengthDto,
      UserNewPasswordLowercaseDto,
      UserNewPasswordUppercaseDto,
      UserNewPasswordNumberDto,
      UserPasswordConfirmationMinLengthDto,
      UserPasswordConfirmationMaxLengthDto,
      UserPasswordConfirmationLowercaseDto,
      UserPasswordConfirmationUppercaseDto,
      UserPasswordConfirmationNumberDto,
    ],
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Exception',
  })
  @ApiUnauthorizedResponse({
    type: UserUnauthorizedDto,
    description: 'Unauthorized',
  })
  async update(
    @Req() req: Request,
    @Body() body: UserPasswordPayloadDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    return await this.userProfileService.update(req.user.id, body)
  }
}
