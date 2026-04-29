import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Request, Response } from 'express'

import { TransformInterceptor } from '@/interceptors/transform.interceptor'
import { JwtAuthenticationGuard } from '@/modules/auth/guards/jwt-authentication.guard'
import { CreateTransactionPayloadDto } from '@/modules/transaction/dtos/create-transaction-payload.dto'
import { TransactionRequestDto } from '@/modules/transaction/dtos/transaction-request.dto'
import {
  TransactionResponseDto,
  TransactionsResponseDto,
} from '@/modules/transaction/dtos/transaction-response.dto'
import { TransactionsFindAllPayloadDto } from '@/modules/transaction/dtos/transactions-find-all-payload.dto'
import { UpdateTransactionPayloadDto } from '@/modules/transaction/dtos/update-transaction-payload.dto'
import { TransactionService } from '@/modules/transaction/services/transaction.service'
import { ApiRestfulResponse } from '@/shared/decorators/api-restful-response.decorator'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'
import { UnauthorizedDto } from '@/shared/dtos/unauthorized.dto'

@Controller('transactions')
@ApiTags('Transactions')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth('JwtToken')
@UseGuards(JwtAuthenticationGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions for the authenticated user' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: TransactionsResponseDto,
    description: 'Successfully returned all transactions.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async findAll(
    @Query() query: TransactionsFindAllPayloadDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<TransactionsResponseDto>> {
    return this.transactionService.findAll(query, request)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a transaction by id' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: TransactionResponseDto,
    description: 'Successfully returned transaction.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async findOne(
    @Param() params: TransactionRequestDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    return this.transactionService.findOne(params.id, request)
  }

  @Post()
  @ApiOperation({ summary: 'Create a transaction' })
  @HttpCode(HttpStatus.CREATED)
  @ApiRestfulResponse({
    status: HttpStatus.CREATED,
    model: TransactionResponseDto,
    description: 'Transaction created successfully.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async create(
    @Body() body: CreateTransactionPayloadDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    return this.transactionService.create(body, request)
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a transaction' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: TransactionResponseDto,
    description: 'Transaction updated successfully.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async update(
    @Param() params: TransactionRequestDto,
    @Body() body: UpdateTransactionPayloadDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    return this.transactionService.update(params.id, body, request)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: TransactionResponseDto,
    description: 'Transaction deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async delete(
    @Param() params: TransactionRequestDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    return this.transactionService.delete(params.id, request)
  }

  @Post('/:id/receipt')
  @ApiOperation({ summary: 'Upload receipt for a transaction' })
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: TransactionResponseDto,
    description: 'Receipt uploaded successfully.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadReceipt(
    @Param() params: TransactionRequestDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    return this.transactionService.uploadReceipt(params.id, file, request)
  }

  @Delete('/:id/receipt')
  @ApiOperation({ summary: 'Delete receipt for a transaction' })
  @HttpCode(HttpStatus.OK)
  @ApiRestfulResponse({
    status: HttpStatus.OK,
    model: TransactionResponseDto,
    description: 'Receipt deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async deleteReceipt(
    @Param() params: TransactionRequestDto,
    @Req() request: Request,
  ): Promise<RestfulResponseDto<TransactionResponseDto>> {
    return this.transactionService.deleteReceipt(params.id, request)
  }

  @Get('/:id/receipt')
  @ApiOperation({ summary: 'Download receipt for a transaction' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedDto,
    description: 'Unauthorized',
  })
  async downloadReceipt(
    @Param() params: TransactionRequestDto,
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<void> {
    const filePath = await this.transactionService.getReceiptFilePath(
      params.id,
      request,
    )
    res.sendFile(filePath)
  }
}
