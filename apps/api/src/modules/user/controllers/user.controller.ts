import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
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
import { UserCannotDeleteYourselfDto } from '@/modules/user/dtos/delete/user-cannot-delete-yourself.dto'
import { UserDeleteRequestDto } from '@/modules/user/dtos/delete/user-delete-request.dto'
import { UserDeleteResponseDto } from '@/modules/user/dtos/delete/user-delete-response.dto'
import { UserEmailExistsDto } from '@/modules/user/dtos/email/user-email-exists.dto'
import { UserEmailUniqueDto } from '@/modules/user/dtos/email/user-email-unique.dto'
import { UserEmailValidDto } from '@/modules/user/dtos/email/user-email-valid.dto'
import { UsersFindAllPayloadDto } from '@/modules/user/dtos/find-all/users-find-all-payload.dto'
import { UsersFindAllResponseDto } from '@/modules/user/dtos/find-all/users-find-all-response.dto'
import { UserNameMaxLengthDto } from '@/modules/user/dtos/name/user-name-max-length.dto'
import { UserNameMinLengthDto } from '@/modules/user/dtos/name/user-name-min-length.dto'
import { UserNameNotValidDto } from '@/modules/user/dtos/name/user-name-not-valid.dto'
import { UserPasswordConfirmationMaxLengthDto } from '@/modules/user/dtos/password-confirmation/user-password-confirmation-max-length.dto'
import { UserPasswordConfirmationMinLengthDto } from '@/modules/user/dtos/password-confirmation/user-password-confirmation-min-lenght.dto'
import { UserPasswordConfirmationNumberDto } from '@/modules/user/dtos/password-confirmation/user-password-confirmation-number.dto'
import { UserPasswordConfirmationUppercaseDto } from '@/modules/user/dtos/password-confirmation/user-password-confirmation-uppercase.dto'
import { UserPasswordLowercaseDto } from '@/modules/user/dtos/password/user-password-lowercase.dto'
import { UserPasswordMaxLengthDto } from '@/modules/user/dtos/password/user-password-max-length.dto'
import { UserPasswordMinLengthDto } from '@/modules/user/dtos/password/user-password-min-length.dto'
import { UserPasswordNumberDto } from '@/modules/user/dtos/password/user-password-number.dto'
import { UserPasswordUppercaseDto } from '@/modules/user/dtos/password/user-password-uppercase.dto'
import { UserUpdatePayloadDto } from '@/modules/user/dtos/update/user-update-payload.dto'
import { UserNotFoundDto } from '@/modules/user/dtos/user-not-found.dto'
import { UserPayloadDto } from '@/modules/user/dtos/user-payload.dto'
import { UserRequestDto } from '@/modules/user/dtos/user-request.dto'
import { UserResponseDto } from '@/modules/user/dtos/user-response.dto'
import { UserUnauthorizedDto } from '@/modules/user/dtos/user-unauthorized.dto'
import { UserService } from '@/modules/user/services/user.service'
import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@Controller('users')
@ApiTags('Users')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('JwtToken')
@UseGuards(JwtAuthenticationGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: UsersFindAllResponseDto,
    description: 'Successfully returned all users',
  })
  @ApiUnauthorizedResponse({
    type: UserUnauthorizedDto,
    description: 'Unauthorized',
  })
  async findAll(
    @Query() query: UsersFindAllPayloadDto,
  ): Promise<RestfulResponseDto<UsersFindAllResponseDto>> {
    return await this.userService.findAll(query)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get an user by id' })
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
    @Param() params: UserRequestDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    return await this.userService.findOne(params)
  }

  @Post()
  @ApiOperation({ summary: 'Create an user' })
  @HttpCode(HttpStatus.CREATED)
  @ApiRestfulResponse({
    model: UserResponseDto,
    status: HttpStatus.CREATED,
    description: 'User created successfully',
  })
  @ApiRestfulResponse({
    model: [
      UserNameMinLengthDto,
      UserNameMaxLengthDto,
      UserNameNotValidDto,
      UserEmailExistsDto,
      UserEmailUniqueDto,
      UserEmailValidDto,
      UserPasswordLowercaseDto,
      UserPasswordUppercaseDto,
      UserPasswordMinLengthDto,
      UserPasswordMaxLengthDto,
      UserPasswordNumberDto,
      UserPasswordConfirmationUppercaseDto,
      UserPasswordConfirmationMinLengthDto,
      UserPasswordConfirmationMaxLengthDto,
      UserPasswordConfirmationNumberDto,
    ],
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Exception',
  })
  @ApiUnauthorizedResponse({
    type: UserUnauthorizedDto,
    description: 'Unauthorized',
  })
  async create(
    @Body() body: UserPayloadDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    return await this.userService.create(body)
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an user' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    model: UserResponseDto,
    status: HttpStatus.OK,
    description: 'User updated successfully',
  })
  @ApiRestfulResponse({
    model: [
      UserNameMinLengthDto,
      UserNameMaxLengthDto,
      UserNameNotValidDto,
      UserEmailExistsDto,
      UserEmailUniqueDto,
      UserEmailValidDto,
      UserPasswordLowercaseDto,
      UserPasswordUppercaseDto,
      UserPasswordMinLengthDto,
      UserPasswordMaxLengthDto,
      UserPasswordNumberDto,
      UserPasswordConfirmationUppercaseDto,
      UserPasswordConfirmationMinLengthDto,
      UserPasswordConfirmationMaxLengthDto,
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
    @Param() params: UserRequestDto,
    @Body() body: UserUpdatePayloadDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    return await this.userService.update(params, body)
  }

  @Delete('/:ids')
  @ApiOperation({ summary: 'Delete an user' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    model: UserDeleteResponseDto,
    status: HttpStatus.OK,
    description: 'User deleted successfully',
  })
  @ApiRestfulResponse({
    model: [UserNotFoundDto, UserCannotDeleteYourselfDto],
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Exception',
  })
  @ApiUnauthorizedResponse({
    type: UserUnauthorizedDto,
    description: 'Unauthorized',
  })
  async delete(
    @Param() params: UserDeleteRequestDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<UserDeleteResponseDto>> {
    return await this.userService.delete(params, request)
  }
}
