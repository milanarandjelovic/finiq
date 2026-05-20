import { Test, TestingModule } from '@nestjs/testing'

import { CategoryController } from '@/modules/category/controllers/category.controller'
import { CategoryService } from '@/modules/category/services/category.service'

describe('CategoryController', () => {
  let controller: CategoryController
  let categoryService: jest.Mocked<CategoryService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<CategoryController>(CategoryController)
    categoryService = module.get(CategoryService)
  })

  it('GET /categories: should call categoryService.findAll', async () => {
    const query = { currentPage: 1 } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.findAll(query, req)

    expect(categoryService.findAll).toHaveBeenCalledWith(query, 'user-1')
  })

  it('POST /categories: should call categoryService.create', async () => {
    const body = { name: 'Test' } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.create(body, req)

    expect(categoryService.create).toHaveBeenCalledWith(body, 'user-1')
  })
})
