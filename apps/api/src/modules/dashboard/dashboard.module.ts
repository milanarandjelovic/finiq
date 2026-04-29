import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BudgetQueryBuilder } from '@/modules/budget/builders/budget-query.builder'
import { Budget } from '@/modules/budget/entities/budget.entity'
import { CategoryQueryBuilder } from '@/modules/category/builders/category-query.builder'
import { Category } from '@/modules/category/entities/category.entity'
import { DashboardQueryBuilder } from '@/modules/dashboard/builders/dashboard-query.builder'
import { DashboardController } from '@/modules/dashboard/controllers/dashboard.controller'
import { DashboardService } from '@/modules/dashboard/services/dashboard.service'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Budget, Category])],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardQueryBuilder,
    BudgetQueryBuilder,
    CategoryQueryBuilder,
  ],
})
export class DashboardModule {}
