import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SettingController } from '@/modules/setting/controllers/setting.controller'
import { Setting } from '@/modules/setting/entities/setting.entity'
import { SettingService } from '@/modules/setting/services/setting.service'

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
