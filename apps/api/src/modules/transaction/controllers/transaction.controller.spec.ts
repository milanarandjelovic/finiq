import { Test, TestingModule } from '@nestjs/testing'

import { TransactionController } from '@/modules/transaction/controllers/transaction.controller'
import { TransactionService } from '@/modules/transaction/services/transaction.service'

describe('TransactionController', () => {
  let controller: TransactionController
  let transactionService: jest.Mocked<TransactionService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            uploadReceipt: jest.fn(),
            deleteReceipt: jest.fn(),
            getReceiptFilePath: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<TransactionController>(TransactionController)
    transactionService = module.get(TransactionService)
  })

  it('GET /transactions: should call transactionService.findAll', async () => {
    const query = { currentPage: 1 } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.findAll(query, req)

    expect(transactionService.findAll).toHaveBeenCalledWith(query, 'user-1')
  })

  it('POST /transactions: should call transactionService.create', async () => {
    const body = { amount: 100 } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.create(body, req)

    expect(transactionService.create).toHaveBeenCalledWith(body, 'user-1')
  })

  it('POST /transactions/:id/receipt: should call transactionService.uploadReceipt', async () => {
    const params = { id: 'tx-1' } as any
    const file = {
      buffer: Buffer.from('test'),
      originalname: 'receipt.pdf',
    } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.uploadReceipt(params, file, req)

    expect(transactionService.uploadReceipt).toHaveBeenCalledWith(
      'tx-1',
      file,
      'user-1',
    )
  })
})
