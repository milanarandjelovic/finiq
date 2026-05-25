import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { EmailVerification } from '@/modules/auth/entities/email-verification.entity'
import { UserQueryBuilder } from '@/modules/user/builders/user-query.builder'
import { User } from '@/modules/user/entities/user.entity'
import { UserService } from '@/modules/user/services/user.service'
import { EmailService } from '@/providers/email/services/email.service'

describe('UserService', () => {
  let service: UserService
  let userRepository: jest.Mocked<Repository<User>>
  let emailVerificationRepository: jest.Mocked<Repository<EmailVerification>>

  const findAllQueryBuilder: any = {
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  }

  const findOneQueryBuilder: any = { getOne: jest.fn() }
  const deleteQueryBuilder: any = { getMany: jest.fn() }

  const mockQueryBuilder: any = {
    createFindAllQueryBuilder: jest.fn().mockReturnValue(findAllQueryBuilder),
    createFindOneQueryBuilder: jest.fn().mockReturnValue(findOneQueryBuilder),
    createDeleteQueryBuilder: jest.fn().mockReturnValue(deleteQueryBuilder),
    applySearchFilters: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(EmailVerification),
          useValue: {
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: UserQueryBuilder,
          useValue: mockQueryBuilder,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'clientUrl') return 'http://localhost:3000'
              if (key === 'email') return { from: 'noreply@test.com' }
              return undefined
            }),
          },
        },
        {
          provide: EmailService,
          useValue: { send: jest.fn() },
        },
        {
          provide: I18nService,
          useValue: { t: jest.fn().mockReturnValue('translated') },
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    userRepository = module.get(getRepositoryToken(User))
    emailVerificationRepository = module.get(
      getRepositoryToken(EmailVerification),
    )
  })

  describe('findAll', () => {
    it('should return paginated users', async () => {
      findAllQueryBuilder.getManyAndCount.mockResolvedValue([
        [{ id: 'user-1' }],
        1,
      ])

      const result = await service.findAll({
        currentPage: 1,
        perPage: 10,
      } as any)

      expect(result.message).toBe('Successfully returned all users')
    })
  })

  describe('create', () => {
    it('should throw when email already exists', async () => {
      userRepository.findOneBy.mockResolvedValue({ id: 'existing' } as any)

      await expect(
        service.create({ name: 'John', email: 'existing@test.com' } as any),
      ).rejects.toThrow()
    })
  })

  describe('delete', () => {
    it('should throw when trying to delete self', async () => {
      const params = { ids: 'user-1,user-2' } as any

      await expect(service.delete(params, 'user-1')).rejects.toThrow()
    })
  })

  describe('findOne', () => {
    it('should return user when found', async () => {
      const user = { id: 'user-1', email: 'test@test.com' }
      findOneQueryBuilder.getOne.mockResolvedValue(user)
      const result = await service.findOne({ id: 'user-1' } as any)

      expect(result.message).toBe('Successfully return user')
      expect(result.data.user).toEqual(user)
    })

    it('should throw when user not found', async () => {
      findOneQueryBuilder.getOne.mockResolvedValue(null)

      await expect(
        service.findOne({ id: 'nonexistent' } as any),
      ).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('should create user with activation email when sendActivationEmail is true', async () => {
      userRepository.findOneBy.mockResolvedValue(null)
      const savedUser = { id: 'user-1', email: 'new@test.com', name: 'New' }
      const saveMock = jest.fn().mockResolvedValue(savedUser)
      jest.mocked(userRepository.create).mockReturnValue({ save: saveMock })
      jest.mocked(emailVerificationRepository.create).mockReturnValue({
        save: jest.fn(),
      })
      const result = await service.create({
        name: 'New',
        email: 'new@test.com',
        password: 'Pass1!',
        sendActivationEmail: true,
      } as any)

      expect(result.message).toBe('User created successfully')
    })

    it('should create user directly when sendActivationEmail is false', async () => {
      userRepository.findOneBy.mockResolvedValue(null)
      const savedUser = { id: 'user-1', email: 'new@test.com', name: 'New' }
      const saveMock = jest.fn().mockResolvedValue(savedUser)
      jest.mocked(userRepository.create).mockReturnValue({ save: saveMock })
      const result = await service.create({
        name: 'New',
        email: 'new@test.com',
        password: 'Pass1!',
        sendActivationEmail: false,
      } as any)

      expect(result.message).toBe('User created successfully')
    })
  })

  describe('update', () => {
    it('should throw when user not found', async () => {
      findOneQueryBuilder.getOne.mockResolvedValue(null)

      await expect(
        service.update(
          { id: 'nonexistent' } as any,
          { name: 'New', email: 'x@x.com' } as any,
        ),
      ).rejects.toThrow()
    })

    it('should throw when email is already taken by another user', async () => {
      const targetUser = { id: 'user-1', name: 'Old', email: 'old@test.com' }
      findOneQueryBuilder.getOne.mockResolvedValue(targetUser)
      userRepository.findOneBy.mockResolvedValue({
        id: 'user-2',
        email: 'taken@test.com',
      } as any)

      await expect(
        service.update(
          { id: 'user-1' } as any,
          { name: 'New', email: 'taken@test.com' } as any,
        ),
      ).rejects.toThrow()
    })

    it('should update user without password when password is not provided', async () => {
      const targetUser = {
        id: 'user-1',
        name: 'Old',
        email: 'old@test.com',
        password: 'hashed',
      }
      findOneQueryBuilder.getOne.mockResolvedValue(targetUser)
      userRepository.findOneBy.mockResolvedValue(null)
      jest.mocked(userRepository.save).mockResolvedValue(targetUser)
      const result = await service.update(
        { id: 'user-1' } as any,
        { name: 'New', email: 'new@test.com' } as any,
      )

      expect(result.message).toBe('User updated successfully')
      expect(targetUser.password).toBe('hashed')
    })

    it('should update user password when provided', async () => {
      const targetUser = {
        id: 'user-1',
        name: 'Old',
        email: 'old@test.com',
        password: 'hashed',
      }
      findOneQueryBuilder.getOne.mockResolvedValue(targetUser)
      userRepository.findOneBy.mockResolvedValue(null)
      jest.mocked(userRepository.save).mockResolvedValue(targetUser)
      const result = await service.update(
        { id: 'user-1' } as any,
        { name: 'New', email: 'new@test.com', password: 'NewPass1!' } as any,
      )

      expect(result.message).toBe('User updated successfully')
      expect(targetUser.password).toBe('NewPass1!')
    })
  })

  describe('delete (extended)', () => {
    it('should throw when no users found with given ids', async () => {
      deleteQueryBuilder.getMany.mockResolvedValue([])

      await expect(
        service.delete(
          { ids: 'nonexistent-1,nonexistent-2' } as any,
          'admin-id',
        ),
      ).rejects.toThrow()
    })

    it('should delete users and return them on success', async () => {
      const users = [{ id: 'user-2' }, { id: 'user-3' }]
      deleteQueryBuilder.getMany.mockResolvedValue(users)
      emailVerificationRepository.delete.mockResolvedValue(undefined as any)
      jest.mocked(userRepository.remove).mockResolvedValue(users)
      const result = await service.delete(
        { ids: 'user-2,user-3' } as any,
        'user-1',
      )

      expect(result.message).toBe('User deleted successfully')
      expect(result.data.users.data).toEqual(users)
    })
  })
})
