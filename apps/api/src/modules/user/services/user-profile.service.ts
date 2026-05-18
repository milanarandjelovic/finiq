import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
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
    private readonly i18n: I18nService,
  ) {}

  async findOne(userId: string): Promise<RestfulResponseDto<UserResponseDto>> {
    const profile = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .getOne()

    if (!profile) {
      throw new ValidationException([
        {
          property: 'name',
          messages: [this.i18n.t('api.userNotFound')],
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
    userId: string,
    data: UserProfilePayloadDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    const { name } = data

    await this.userRepository.update({ id: userId }, { name })

    const profile = await this.userRepository.findOne({
      where: { id: userId },
    })

    return new RestfulResponseDto<UserResponseDto>({
      message: 'Successfully return user',
      data: {
        user: profile,
      },
    })
  }
}
