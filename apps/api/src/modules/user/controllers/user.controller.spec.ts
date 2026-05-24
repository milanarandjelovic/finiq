import { Test, TestingModule } from '@nestjs/testing'

import { UserController } from '@/modules/user/controllers/user.controller'
import { UserService } from '@/modules/user/services/user.service'

describe('UserController', () => {
  let controller: UserController
  let userService: jest.Mocked<UserService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
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

    controller = module.get<UserController>(UserController)
    userService = module.get(UserService)
  })

  it('GET /users/:id: should call userService.findOne', async () => {
    const params = { id: 'user-1' } as any
    await controller.findOne(params)

    expect(userService.findOne).toHaveBeenCalledWith(params)
  })

  it('PUT /users/:id: should call userService.update', async () => {
    const params = { id: 'user-1' } as any
    const body = { name: 'Updated', email: 'u@test.com' } as any
    await controller.update(params, body)

    expect(userService.update).toHaveBeenCalledWith(params, body)
  })

  it('GET /users: should call userService.findAll', async () => {
    const query = { currentPage: 1 } as any
    await controller.findAll(query)

    expect(userService.findAll).toHaveBeenCalledWith(query)
  })

  it('POST /users: should call userService.create', async () => {
    const body = { name: 'John', email: 'john@test.com' } as any
    await controller.create(body)

    expect(userService.create).toHaveBeenCalledWith(body)
  })

  it('DELETE /users/:ids: should call userService.delete with req.user.id', async () => {
    const params = { ids: 'user-2,user-3' } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.delete(params, req)

    expect(userService.delete).toHaveBeenCalledWith(params, 'user-1')
  })
})
