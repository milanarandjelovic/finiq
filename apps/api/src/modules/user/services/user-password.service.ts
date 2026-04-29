import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { compareSync } from 'bcrypt'
import { Request } from 'express'
import { Repository } from 'typeorm'

import { ValidationException } from '@/exceptions/validation.exception'
import { UserPasswordPayloadDto } from '@/modules/user/dtos/password/user-password-payload.dto'
import { UserResponseDto } from '@/modules/user/dtos/user-response.dto'
import { User } from '@/modules/user/entities/user.entity'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

@Injectable()
export class UserPasswordService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async update(
    request: Request,
    data: UserPasswordPayloadDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    const { user } = request
    const { password, newPassword } = data

    if (!user) {
      throw new ValidationException([
        {
          property: 'name',
          messages: ['User not found.'],
        },
      ])
    }

    const check = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: user.id })
      .getOne()

    if (user.id !== check.id) {
      throw new ValidationException([
        {
          property: 'name',
          messages: ['User not found.'],
        },
      ])
    }

    if (!compareSync(password, check.password)) {
      throw new ValidationException([
        {
          property: 'password',
          messages: ['Current password is invalid.'],
        },
      ])
    }

    // Update method not trigger @BeforeUpdate() in User repository
    // so we need to trigger in this way
    const profile = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    })

    user.password = newPassword
    user.save()

    return new RestfulResponseDto<UserResponseDto>({
      message: 'Successfully return user',
      data: {
        user: profile,
      },
    })
  }
}
