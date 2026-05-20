import { Test, TestingModule } from '@nestjs/testing'

import { DashboardController } from '@/modules/dashboard/controllers/dashboard.controller'
import { DashboardService } from '@/modules/dashboard/services/dashboard.service'

describe('DashboardController', () => {
  let controller: DashboardController
  let dashboardService: jest.Mocked<DashboardService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: { getDashboard: jest.fn() },
        },
      ],
    }).compile()

    controller = module.get<DashboardController>(DashboardController)
    dashboardService = module.get(DashboardService)
  })

  it('GET /dashboard: should call dashboardService.getDashboard with query and user id', async () => {
    const query = { month: 3, year: 2026 } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.getDashboard(query, req)

    expect(dashboardService.getDashboard).toHaveBeenCalledWith(query, 'user-1')
  })
})
