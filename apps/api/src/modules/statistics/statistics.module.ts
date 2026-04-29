import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { StatisticsQueryBuilder } from '@/modules/statistics/builders/statistics-query.builder'
import { StatisticsController } from '@/modules/statistics/controllers/statistics.controller'
import { StatisticsService } from '@/modules/statistics/services/statistics.service'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsQueryBuilder],
})
export class StatisticsModule {}
