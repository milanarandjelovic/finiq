import { Test, TestingModule } from '@nestjs/testing'

import { StatisticsController } from '@/modules/statistics/controllers/statistics.controller'
import { StatisticsService } from '@/modules/statistics/services/statistics.service'

describe('StatisticsController', () => {
  let controller: StatisticsController
  let statisticsService: jest.Mocked<StatisticsService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        {
          provide: StatisticsService,
          useValue: { getStatistics: jest.fn() },
        },
      ],
    }).compile()

    controller = module.get<StatisticsController>(StatisticsController)
    statisticsService = module.get(StatisticsService)
  })

  it('GET /statistics: should call statisticsService.getStatistics with query and user id', async () => {
    const query = { month: 3, year: 2026 } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.getStatistics(query, req)

    expect(statisticsService.getStatistics).toHaveBeenCalledWith(
      query,
      'user-1',
    )
  })
})
