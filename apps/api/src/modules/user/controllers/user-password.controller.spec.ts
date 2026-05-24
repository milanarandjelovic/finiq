import { Test, TestingModule } from '@nestjs/testing'

import { UserPasswordController } from '@/modules/user/controllers/user-password.controller'
import { UserPasswordService } from '@/modules/user/services/user-password.service'

describe('UserPasswordController', () => {
  let controller: UserPasswordController
  let userPasswordService: jest.Mocked<UserPasswordService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPasswordController],
      providers: [
        {
          provide: UserPasswordService,
          useValue: { update: jest.fn() },
        },
      ],
    }).compile()

    controller = module.get<UserPasswordController>(UserPasswordController)
    userPasswordService = module.get(UserPasswordService)
  })

  it('POST /user/password: should call userPasswordService.update', async () => {
    const body = { password: 'old', newPassword: 'NewPass1!' } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.update(req, body)

    expect(userPasswordService.update).toHaveBeenCalledWith('user-1', body)
  })
})
