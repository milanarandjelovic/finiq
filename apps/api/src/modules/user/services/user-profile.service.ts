import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { Repository } from 'typeorm'

import { ValidationException } from '@/exceptions/validation.exception'
import { UserProfilePayloadDto } from '@/modules/user/dtos/profile/user-profile-payload.dto'
import { UserResponseDto } from '@/modules/user/dtos/user-response.dto'
import { User } from '@/modules/user/entities/user.entity'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(
    request: Request,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    const { user } = request

    if (!user) {
      throw new ValidationException([
        {
          property: 'name',
          messages: ['User not found.'],
        },
      ])
    }

    const queryBuilder = this.userRepository.createQueryBuilder('user')
    queryBuilder.where('user.id = :id', { id: user.id })

    const profile = await queryBuilder.getOne()

    if (!profile) {
      throw new ValidationException([
        {
          property: 'name',
          messages: ['User not found.'],
        },
      ])
    }

    return new RestfulResponseDto<UserResponseDto>({
      message: 'Successfully return user',
      data: {
        user: profile,
      },
    })
  }

  async update(
    request: Request,
    data: UserProfilePayloadDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    const { user } = request
    const { name } = data

    if (!user) {
      throw new ValidationException([
        {
          property: 'name',
          messages: ['User not found.'],
        },
      ])
    }

    const check = await this.userRepository.findOne({
      where: { id: user.id },
    })

    if (user.id !== check.id) {
      throw new ValidationException([
        {
          property: 'name',
          messages: ['User not found.'],
        },
      ])
    }

    await this.userRepository.update({ id: user.id }, { name })

    const profile = await this.userRepository.findOne({
      where: { id: user.id },
    })

    return new RestfulResponseDto<UserResponseDto>({
      message: 'Successfully return user',
      data: {
        user: profile,
      },
    })
  }
}
