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
import { StatisticsQueryDto } from '@/modules/statistics/dtos/statistics-query.dto'
import { StatisticsResponseDto } from '@/modules/statistics/dtos/statistics-response.dto'
import { StatisticsService } from '@/modules/statistics/services/statistics.service'
import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'
import { UnauthorizedDto } from '@/shared/dtos/unauthorized.dto'

@Controller('statistics')
@ApiTags('Statistics')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('JwtToken')
@UseGuards(JwtAuthenticationGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get spending by category and 6-month trend' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: StatisticsResponseDto,
    description: 'Successfully returned statistics.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async getStatistics(
    @Query() query: StatisticsQueryDto,
    @Req() req: Request,
  ): Promise<RestfulResponseDto<StatisticsResponseDto>> {
    return this.statisticsService.getStatistics(query, req.user.id)
  }
}
