import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { HealthResponseDto } from '@/modules/app/dtos/health/health-response.dto'

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Finiq API'
  }

  getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: this.configService.get<string>('NODE_ENV') || 'development',
      version: this.configService.get<string>('appVersion') || '1.0.0',
    }
  }
}
