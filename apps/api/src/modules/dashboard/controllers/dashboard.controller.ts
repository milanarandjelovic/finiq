import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import type { Request } from 'express'

import { TransformInterceptor } from '@/interceptors/transform.interceptor'
import { JwtAuthenticationGuard } from '@/modules/auth/guards/jwt-authentication.guard'
import { DashboardQueryDto } from '@/modules/dashboard/dtos/dashboard-query.dto'
import { DashboardResponseDto } from '@/modules/dashboard/dtos/dashboard-response.dto'
import { DashboardService } from '@/modules/dashboard/services/dashboard.service'
import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'
import { UnauthorizedDto } from '@/shared/dtos/unauthorized.dto'

@Controller('dashboard')
@ApiTags('Dashboard')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('JwtToken')
@UseGuards(JwtAuthenticationGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard summary for a given month/year' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: DashboardResponseDto,
    description: 'Successfully returned dashboard.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async getDashboard(
    @Query() query: DashboardQueryDto,
    @Req() req: Request,
  ): Promise<RestfulResponseDto<DashboardResponseDto>> {
    return this.dashboardService.getDashboard(query, req.user.id)
  }
}
