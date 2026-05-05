import * as fs from 'fs'
import * as path from 'path'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class LocalesService {
  private readonly translationsDir: string

  constructor() {
    const translationsMain = require.resolve('@finiq/translations')
    this.translationsDir = path.join(
      path.dirname(translationsMain),
      '..',
      'src',
      'locales',
    )
  }

  getLocale(lang: string): Record<string, unknown> {
    const safeLang = lang.replace(/[^a-zA-Z0-9_-]/g, '')
    const filePath = path.join(this.translationsDir, `${safeLang}.json`)

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Locale "${safeLang}" not found`)
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  }

  getAvailableLocales(): string[] {
    if (!fs.existsSync(this.translationsDir)) {
      return []
    }

    return fs
      .readdirSync(this.translationsDir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''))
  }
}
