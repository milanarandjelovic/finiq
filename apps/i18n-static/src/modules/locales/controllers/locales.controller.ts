import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common'
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { LocaleNotFoundDto } from '@/modules/locales/dtos/locale-not-found.dto'
import { LocalesService } from '@/modules/locales/services/locales.service'

@ApiTags('Locales')
@Controller('locales')
export class LocalesController {
  constructor(private readonly localesService: LocalesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List available locales' })
  getAvailableLocales(): string[] {
    return this.localesService.getAvailableLocales()
  }

  @Get(':lang')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get translations for a language' })
  @ApiNotFoundResponse({
    description: 'Locale not found',
    type: LocaleNotFoundDto,
  })
  getLocale(@Param('lang') lang: string, @Res() res: Response): void {
    const data = this.localesService.getLocale(lang)

    res
      // .set('Cache-Control', 'public, max-age=86400')
      .set('Content-Type', 'application/json')
      .json(data)
  }
}
