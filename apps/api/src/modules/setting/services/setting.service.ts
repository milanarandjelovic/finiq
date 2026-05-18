import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { SettingsResponseDto } from '@/modules/setting/dtos/settings-response.dto'
import { UpdateSettingsPayloadDto } from '@/modules/setting/dtos/update-settings-payload.dto'
import { Setting } from '@/modules/setting/entities/setting.entity'
import { User } from '@/modules/user/entities/user.entity'
import { RestfulResponseDto } from '@/shared/dtos/restful-response.dto'

const DEFAULTS: Record<string, string> = {
  currency: 'USD',
}

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  private toSettingsObject(rows: Setting[]): Record<string, string> {
    const result = { ...DEFAULTS }

    for (const row of rows) {
      result[row.key] = row.value
    }

    return result
  }

  async findAll(
    userId: string,
  ): Promise<RestfulResponseDto<SettingsResponseDto>> {
    const rows = await this.settingRepository.find({
      where: { user: { id: userId } },
    })

    return new RestfulResponseDto<SettingsResponseDto>({
      message: 'Successfully returned settings.',
      data: { settings: this.toSettingsObject(rows) as any },
    })
  }

  async update(
    data: UpdateSettingsPayloadDto,
    userId: string,
  ): Promise<RestfulResponseDto<SettingsResponseDto>> {
    const entries = Object.entries(data).filter(([, v]) => v !== undefined) as [
      string,
      string,
    ][]

    for (const [key, value] of entries) {
      const existing = await this.settingRepository.findOne({
        where: { user: { id: userId }, key },
      })

      if (existing) {
        existing.value = value
        await this.settingRepository.save(existing)
      } else {
        await this.settingRepository
          .create({ key, value, user: { id: userId } as User })
          .save()
      }
    }

    const rows = await this.settingRepository.find({
      where: { user: { id: userId } },
    })

    return new RestfulResponseDto<SettingsResponseDto>({
      message: 'Settings updated successfully.',
      data: {
        settings: this.toSettingsObject(rows) as any,
      },
    })
  }
}
