import {
  Body,
  Controller,
  Get,
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
import { UserNameMaxLengthDto } from '@/modules/user/dtos/name/user-name-max-length.dto'
import { UserNameMinLengthDto } from '@/modules/user/dtos/name/user-name-min-length.dto'
import { UserNameNotValidDto } from '@/modules/user/dtos/name/user-name-not-valid.dto'
import { UserProfilePayloadDto } from '@/modules/user/dtos/profile/user-profile-payload.dto'
import { UserNotFoundDto } from '@/modules/user/dtos/user-not-found.dto'
import { UserResponseDto } from '@/modules/user/dtos/user-response.dto'
import { UserUnauthorizedDto } from '@/modules/user/dtos/user-unauthorized.dto'
import { UserProfileService } from '@/modules/user/services/user-profile.service'
import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@Controller('user/profile')
@ApiTags('User Profile')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('JwtToken')
@UseGuards(JwtAuthenticationGuard)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get a user profile' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    model: UserResponseDto,
    status: HttpStatus.OK,
    description: 'Successfully return user',
  })
  @ApiRestfulResponse({
    model: UserNotFoundDto,
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Exception',
  })
  @ApiUnauthorizedResponse({
    type: UserUnauthorizedDto,
    description: 'Unauthorized',
  })
  async findOne(
    @Req() req: Request,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    return await this.userProfileService.findOne(req.user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Update a user profile' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    model: UserResponseDto,
    status: HttpStatus.OK,
    description: 'Successfully return user',
  })
  @ApiRestfulResponse({
    model: [
      UserNameMinLengthDto,
      UserNameMaxLengthDto,
      UserNotFoundDto,
      UserNameNotValidDto,
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
    @Body() body: UserProfilePayloadDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    return await this.userProfileService.update(req.user.id, body)
  }
}
