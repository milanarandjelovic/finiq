import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { User } from '@/modules/user/entities/user.entity'
import { UserProfileService } from '@/modules/user/services/user-profile.service'

describe('UserProfileService', () => {
  let service: UserProfileService
  let userRepository: jest.Mocked<Repository<User>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            })),
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: { t: jest.fn().mockReturnValue('translated') },
        },
      ],
    }).compile()

    service = module.get<UserProfileService>(UserProfileService)
    userRepository = module.get(getRepositoryToken(User))
  })

  it('findOne: should throw when user not found', async () => {
    const qb = jest.mocked(userRepository.createQueryBuilder)
    ;(qb() as any).getOne.mockResolvedValue(null)

    await expect(service.findOne('nonexistent')).rejects.toThrow()
  })

  it('update: should update the user name', async () => {
    userRepository.findOne.mockResolvedValue({
      id: 'user-1',
      name: 'Old',
    } as any)
    const result = await service.update('user-1', { name: 'New' } as any)

    expect(userRepository.update).toHaveBeenCalledWith(
      { id: 'user-1' },
      { name: 'New' },
    )
  })

  it('findOne: should return user when found', async () => {
    const user = { id: 'user-1', name: 'John', email: 'john@test.com' }
    const mockQb = {
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    }
    jest
      .mocked(userRepository.createQueryBuilder)
      .mockReturnValue(mockQb as any)
    const result = await service.findOne('user-1')

    expect(result.message).toBe('Successfully return user')
    expect(result.data.user).toEqual(user)
  })
})
