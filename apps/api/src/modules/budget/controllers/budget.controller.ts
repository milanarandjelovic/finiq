import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
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
import { BudgetQueryDto } from '@/modules/budget/dtos/budget-query.dto'
import {
  BudgetResponseDto,
  BudgetsResponseDto,
} from '@/modules/budget/dtos/budget-response.dto'
import { CopyBudgetPayloadDto } from '@/modules/budget/dtos/copy-budget-payload.dto'
import { UpsertBudgetPayloadDto } from '@/modules/budget/dtos/upsert-budget-payload.dto'
import { BudgetService } from '@/modules/budget/services/budget.service'
import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'
import { UnauthorizedDto } from '@/shared/dtos/unauthorized.dto'

@Controller('budgets')
@ApiTags('Budgets')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('JwtToken')
@UseGuards(JwtAuthenticationGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  @ApiOperation({ summary: 'Get all budgets for a given month/year' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: BudgetsResponseDto,
    description: 'Successfully returned all budgets.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async findAll(
    @Query() query: BudgetQueryDto,
    @Req() req: Request,
  ): Promise<RestfulResponseDto<BudgetsResponseDto>> {
    return this.budgetService.findAll(query, req.user.id)
  }

  @Put()
  @ApiOperation({
    summary: 'Create or update a budget for a category/month/year',
  })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: BudgetResponseDto,
    description: 'Budget saved successfully.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async upsert(
    @Body() body: UpsertBudgetPayloadDto,
    @Req() req: Request,
  ): Promise<RestfulResponseDto<BudgetResponseDto>> {
    return this.budgetService.upsert(body, req.user.id)
  }

  @Post('/copy')
  @ApiOperation({ summary: 'Copy budgets from the previous month' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: BudgetsResponseDto,
    description: 'Budgets copied successfully.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async copyFromPreviousMonth(
    @Body() body: CopyBudgetPayloadDto,
    @Req() req: Request,
  ): Promise<RestfulResponseDto<BudgetsResponseDto>> {
    return this.budgetService.copyFromPreviousMonth(body, req.user.id)
  }
}
