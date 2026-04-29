import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { In, Not, Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { Configuration } from '@/config/interfaces/configuration.interface'
import { ValidationException } from '@/exceptions/validation.exception'
import { generatePaginationMetadata } from '@/helpers/pagination'
import { EmailVerification } from '@/modules/auth/entities/email-verification.entity'
import { UserQueryBuilder } from '@/modules/user/builders/user-query.builder'
import { UserDeleteRequestDto } from '@/modules/user/dtos/delete/user-delete-request.dto'
import { UserDeleteResponseDto } from '@/modules/user/dtos/delete/user-delete-response.dto'
import { UsersFindAllPayloadDto } from '@/modules/user/dtos/find-all/users-find-all-payload.dto'
import { UsersFindAllResponseDto } from '@/modules/user/dtos/find-all/users-find-all-response.dto'
import { UserUpdatePayloadDto } from '@/modules/user/dtos/update/user-update-payload.dto'
import { UserPayloadDto } from '@/modules/user/dtos/user-payload.dto'
import { UserRequestDto } from '@/modules/user/dtos/user-request.dto'
import { UserResponseDto } from '@/modules/user/dtos/user-response.dto'
import { User } from '@/modules/user/entities/user.entity'
import { EmailService } from '@/providers/email/services/email.service'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    private readonly userQueryBuilder: UserQueryBuilder,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(
    query: UsersFindAllPayloadDto,
  ): Promise<RestfulResponseDto<UsersFindAllResponseDto>> {
    const { perPage, currentPage } = query
    const queryBuilder = this.userQueryBuilder.createFindAllQueryBuilder()

    this.userQueryBuilder.applySearchFilters(queryBuilder, query)

    const [users, total] = await queryBuilder
      .skip((currentPage - 1) * perPage)
      .take(perPage)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount()

    return new RestfulResponseDto<UsersFindAllResponseDto>({
      message: 'Successfully returned all users',
      data: {
        users: {
          data: users,
          meta: {
            pagination: generatePaginationMetadata({
              currentPage,
              total,
              perPage,
            }),
          },
        },
      },
    })
  }

  async findOne(
    params: UserRequestDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    const { id } = params

    const user = await this.userQueryBuilder
      .createFindOneQueryBuilder(id)
      .getOne()

    if (!user) {
      throw new ValidationException([
        {
          property: 'id',
          messages: ['User not found.'],
        },
      ])
    }

    return new RestfulResponseDto<UserResponseDto>({
      message: 'Successfully return user',
      data: {
        user,
      },
    })
  }

  async create(
    data: UserPayloadDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    const { name, email, password, sendActivationEmail } = data

    const existingUser = await this.userRepository.findOneBy({ email })

    if (existingUser) {
      throw new ValidationException([
        {
          property: 'email',
          messages: ['The email has already been taken.'],
        },
      ])
    }

    if (sendActivationEmail) {
      const user = await this.userRepository
        .create({
          name,
          email,
          password: uuidv4(),
          activatedAt: null,
        })
        .save()

      const token = uuidv4()
      await this.emailVerificationRepository.create({ token, user }).save()

      const url =
        this.configService.get<Configuration['clientUrl']>('clientUrl')
      const emailClient =
        this.configService.get<Configuration['email']>('email')

      await this.emailService.send({
        subject: 'Email Verification',
        from: emailClient.from,
        to: user.email,
        template: 'auth/email-verification',
        context: {
          name: user.name,
          link: `${url}/auth/verify-email/${token}`,
        },
      })

      return new RestfulResponseDto<UserResponseDto>({
        message: 'User created successfully',
        data: {
          user,
        },
      })
    }

    const user = await this.userRepository
      .create({
        name,
        email,
        password,
        activatedAt: new Date(),
      })
      .save()

    return new RestfulResponseDto<UserResponseDto>({
      message: 'User created successfully',
      data: {
        user,
      },
    })
  }

  async update(
    params: UserRequestDto,
    data: UserUpdatePayloadDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    const { id } = params
    const { name, email, password } = data

    const targetUser = await this.userQueryBuilder
      .createFindOneQueryBuilder(id)
      .getOne()

    if (!targetUser) {
      throw new ValidationException([
        {
          property: 'id',
          messages: ['User not found.'],
        },
      ])
    }

    const existingEmail = await this.userRepository.findOneBy({
      id: Not(id),
      email,
    })

    if (existingEmail) {
      throw new ValidationException([
        {
          property: 'email',
          messages: ['The email has already been taken.'],
        },
      ])
    }

    targetUser.name = name
    targetUser.email = email

    if (password) {
      targetUser.password = password
    }

    await this.userRepository.save(targetUser)

    return new RestfulResponseDto<UserResponseDto>({
      message: 'User updated successfully',
      data: {
        user: targetUser,
      },
    })
  }

  async delete(
    params: UserDeleteRequestDto,
    request: Request,
  ): Promise<RestfulResponseDto<UserDeleteResponseDto>> {
    const { ids } = params
    const { user: authenticatedUser } = request
    const idsArray = ids.split(',')

    if (idsArray.includes(authenticatedUser.id)) {
      throw new ValidationException([
        {
          property: 'id',
          messages: ['You cannot delete yourself.'],
        },
      ])
    }

    const users = await this.userQueryBuilder
      .createDeleteQueryBuilder(idsArray)
      .getMany()

    if (users.length === 0) {
      throw new ValidationException([
        {
          property: 'ids',
          messages: ['Users not found.'],
        },
      ])
    }

    await this.emailVerificationRepository.delete({
      user: { id: In(users.map((u) => u.id)) },
    })

    await this.userRepository.remove(users)

    return new RestfulResponseDto<UserDeleteResponseDto>({
      message: 'User deleted successfully',
      data: {
        users: {
          data: users,
        },
      },
    })
  }
}
