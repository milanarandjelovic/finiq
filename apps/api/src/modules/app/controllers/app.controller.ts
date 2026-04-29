import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger'

import { HealthResponseDto } from '@/modules/app/dtos/health/health-response.dto'
import { AppService } from '@/modules/app/services/app.service'
import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Health Check' })
  @ApiRestfulResponse({
    model: HealthResponseDto,
    status: HttpStatus.OK,
    description: 'Health check endpoint',
  })
  async getHealth(): Promise<RestfulResponseDto<HealthResponseDto>> {
    const data = this.appService.getHealth()
    return new RestfulResponseDto({
      message: 'Health check successful',
      data,
    })
  }
}
