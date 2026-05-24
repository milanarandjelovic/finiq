import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { User } from '@/modules/user/entities/user.entity'
import { UserPasswordService } from '@/modules/user/services/user-password.service'

describe('UserPasswordService', () => {
  let service: UserPasswordService
  let userRepository: jest.Mocked<Repository<User>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserPasswordService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            })),
            findOne: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: { t: jest.fn().mockReturnValue('translated') },
        },
      ],
    }).compile()

    service = module.get<UserPasswordService>(UserPasswordService)
    userRepository = module.get(getRepositoryToken(User))
  })

  it('update: should throw when user not found', async () => {
    const qb = userRepository.createQueryBuilder as jest.Mock
    qb().getOne.mockResolvedValue(null)

    await expect(
      service.update('nonexistent', {
        password: 'old',
        newPassword: 'NewPass1!',
      } as any),
    ).rejects.toThrow()
  })

  it('update: should throw when current password is wrong', async () => {
    const user = {
      id: 'user-1',
      password: '$2b$10$invalid_hash_that_wont_match',
      save: jest.fn(),
    }
    const mockQb = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    }
    ;(userRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQb)

    await expect(
      service.update('user-1', {
        password: 'wrongPassword',
        newPassword: 'NewPass1!',
      } as any),
    ).rejects.toThrow()
  })

  it('update: should update password and return updated user on success', async () => {
    const { hashSync } = require('bcrypt')
    const plainPassword = 'CurrentPass1!'
    const hashedPassword = hashSync(plainPassword, 10)
    const user = {
      id: 'user-1',
      password: hashedPassword,
      save: jest.fn().mockResolvedValue(undefined),
    }
    const mockQb = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    }
    ;(userRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQb)
    const updatedProfile = { id: 'user-1', name: 'John' }
    ;(userRepository.findOne as jest.Mock).mockResolvedValue(updatedProfile)

    const result = await service.update('user-1', {
      password: plainPassword,
      newPassword: 'NewPass1!',
    } as any)

    expect(user.save).toHaveBeenCalled()
    expect(result.data.user).toEqual(updatedProfile)
  })
})
