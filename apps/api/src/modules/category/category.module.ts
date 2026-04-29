import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryQueryBuilder } from '@/modules/category/builders/category-query.builder'
import { CategoryController } from '@/modules/category/controllers/category.controller'
import { Category } from '@/modules/category/entities/category.entity'
import { CategoryService } from '@/modules/category/services/category.service'

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryQueryBuilder],
  exports: [CategoryService, CategoryQueryBuilder],
})
export class CategoryModule {}
