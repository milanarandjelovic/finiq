import { Module } from '@nestjs/common'

import { LocalesController } from '@/modules/locales/controllers/locales.controller'
import { LocalesService } from '@/modules/locales/services/locales.service'

@Module({
  controllers: [LocalesController],
  providers: [LocalesService],
})
export class LocalesModule {}
