import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { UsersFindAllPayloadDto } from '@/modules/user/dtos/find-all/users-find-all-payload.dto'
import { User } from '@/modules/user/entities/user.entity'

@Injectable()
export class UserQueryBuilder {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createFindAllQueryBuilder(): SelectQueryBuilder<User> {
    return this.userRepository.createQueryBuilder('user')
  }

  createFindOneQueryBuilder(id: string): SelectQueryBuilder<User> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })

    return queryBuilder
  }

  createDeleteQueryBuilder(ids: string[]): SelectQueryBuilder<User> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids })

    return queryBuilder
  }

  applySearchFilters(
    queryBuilder: SelectQueryBuilder<User>,
    query: UsersFindAllPayloadDto,
  ): void {
    if (query.name) {
      queryBuilder.andWhere('user.name ILIKE :name', {
        name: `%${query.name}%`,
      })
    }
  }
}
