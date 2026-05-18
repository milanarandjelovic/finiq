import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { compareSync } from 'bcrypt'
import { I18nService } from 'nestjs-i18n'
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
    private readonly i18n: I18nService,
  ) {}

  async update(
    userId: string,
    data: UserPasswordPayloadDto,
  ): Promise<RestfulResponseDto<UserResponseDto>> {
    const { password, newPassword } = data

    const check = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne()

    if (!check) {
      throw new ValidationException([
        {
          property: 'name',
          messages: [this.i18n.t('api.userNotFound')],
        },
      ])
    }

    if (!compareSync(password, check.password)) {
      throw new ValidationException([
        {
          property: 'password',
          messages: [this.i18n.t('api.currentPasswordInvalid')],
        },
      ])
    }

    check.password = newPassword
    await check.save()

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
