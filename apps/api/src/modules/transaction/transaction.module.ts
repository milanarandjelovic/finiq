import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Category } from '@/modules/category/entities/category.entity'
import { TransactionQueryBuilder } from '@/modules/transaction/builders/transaction-query.builder'
import { TransactionController } from '@/modules/transaction/controllers/transaction.controller'
import { Transaction } from '@/modules/transaction/entities/transaction.entity'
import { TransactionService } from '@/modules/transaction/services/transaction.service'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Category])],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionQueryBuilder],
  exports: [TransactionService, TransactionQueryBuilder],
})
export class TransactionModule {}
