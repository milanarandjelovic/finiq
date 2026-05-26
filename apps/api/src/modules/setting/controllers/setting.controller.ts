import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
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
import type { Request } from 'express'

import { TransformInterceptor } from '@/interceptors/transform.interceptor'
import { JwtAuthenticationGuard } from '@/modules/auth/guards/jwt-authentication.guard'
import { SettingsResponseDto } from '@/modules/setting/dtos/settings-response.dto'
import { UpdateSettingsPayloadDto } from '@/modules/setting/dtos/update-settings-payload.dto'
import { SettingService } from '@/modules/setting/services/setting.service'
import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'
import { UnauthorizedDto } from '@/shared/dtos/unauthorized.dto'

@Controller('settings')
@ApiTags('Settings')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('JwtToken')
@UseGuards(JwtAuthenticationGuard)
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @ApiOperation({ summary: 'Get settings for the authenticated user' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: SettingsResponseDto,
    description: 'Successfully returned settings.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async findAll(
    @Req() req: Request,
  ): Promise<RestfulResponseDto<SettingsResponseDto>> {
    return this.settingService.findAll(req.user.id)
  }

  @Put()
  @ApiOperation({ summary: 'Update settings for the authenticated user' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: SettingsResponseDto,
    description: 'Settings updated successfully.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async update(
    @Body() body: UpdateSettingsPayloadDto,
    @Req() req: Request,
  ): Promise<RestfulResponseDto<SettingsResponseDto>> {
    return this.settingService.update(body, req.user.id)
  }
}
