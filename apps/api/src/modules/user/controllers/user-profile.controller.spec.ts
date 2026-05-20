import { Test, TestingModule } from '@nestjs/testing'

import { UserProfileController } from '@/modules/user/controllers/user-profile.controller'
import { UserProfileService } from '@/modules/user/services/user-profile.service'

describe('UserProfileController', () => {
  let controller: UserProfileController
  let userProfileService: jest.Mocked<UserProfileService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProfileController],
      providers: [
        {
          provide: UserProfileService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<UserProfileController>(UserProfileController)
    userProfileService = module.get(UserProfileService)
  })

  it('GET /user/profile: should call userProfileService.findOne', async () => {
    const req = { user: { id: 'user-1' } } as any
    await controller.findOne(req)

    expect(userProfileService.findOne).toHaveBeenCalledWith('user-1')
  })

  it('POST /user/profile: should call userProfileService.update', async () => {
    const body = { name: 'New' } as any
    const req = { user: { id: 'user-1' } } as any
    await controller.update(req, body)

    expect(userProfileService.update).toHaveBeenCalledWith('user-1', body)
  })
})
