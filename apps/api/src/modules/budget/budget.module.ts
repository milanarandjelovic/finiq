import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BudgetQueryBuilder } from '@/modules/budget/builders/budget-query.builder'
import { BudgetController } from '@/modules/budget/controllers/budget.controller'
import { Budget } from '@/modules/budget/entities/budget.entity'
import { BudgetService } from '@/modules/budget/services/budget.service'
import { Category } from '@/modules/category/entities/category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Category])],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetQueryBuilder],
  exports: [BudgetService, BudgetQueryBuilder],
})
export class BudgetModule {}
