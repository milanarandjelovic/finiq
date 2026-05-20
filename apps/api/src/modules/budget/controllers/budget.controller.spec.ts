import { Test, TestingModule } from '@nestjs/testing'

import { BudgetController } from '@/modules/budget/controllers/budget.controller'
import { BudgetService } from '@/modules/budget/services/budget.service'

describe('BudgetController', () => {
  let controller: BudgetController
  let budgetService: jest.Mocked<BudgetService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetController],
      providers: [
        {
          provide: BudgetService,
          useValue: {
            findAll: jest.fn(),
            upsert: jest.fn(),
            copyFromPreviousMonth: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<BudgetController>(BudgetController)
    budgetService = module.get(BudgetService)
  })

  it('GET /budgets: should call budgetService.findAll with query and user id', async () => {
    const query = { month: 1, year: 2026 } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.findAll(query, req)

    expect(budgetService.findAll).toHaveBeenCalledWith(query, 'user-1')
  })

  it('PUT /budgets: should call budgetService.upsert with body and user id', async () => {
    const body = { categoryId: 'cat-1', amount: 100 } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.upsert(body, req)

    expect(budgetService.upsert).toHaveBeenCalledWith(body, 'user-1')
  })

  it('POST /budgets/copy: should call budgetService.copyFromPreviousMonth with body and user id', async () => {
    const body = { month: 2, year: 2026 } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.copyFromPreviousMonth(body, req)

    expect(budgetService.copyFromPreviousMonth).toHaveBeenCalledWith(
      body,
      'user-1',
    )
  })
})
