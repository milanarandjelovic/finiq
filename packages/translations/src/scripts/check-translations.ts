#!/usr/bin/env node

/**
 * Script to check for missing translation keys
 * Compares all locale files against the reference (en.json)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LOCALES_DIR = path.join(__dirname, '../locales')
const REFERENCE_LOCALE = 'en'

interface TranslationObject {
  [key: string]: string | TranslationObject
}

/**
 * Get all keys from a nested object as dot-notation paths
 *
 * @param {TranslationObject} obj - Nested object
 * @param {string} [prefix=''] - Optional prefix to prepend to keys
 * @returns {string[]} Array of keys
 */
function getKeys(obj: TranslationObject, prefix = ''): string[] {
  const keys: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getKeys(value, fullKey))
    } else {
      keys.push(fullKey)
    }
  }

  return keys
}

/**
 * Read and parse a JSON file
 *
 * @param {string} filePath - Path to JSON file
 * @returns {TranslationObject} Parsed JSON object
 */
function readJsonFile(filePath: string): TranslationObject {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content) as TranslationObject
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error reading ${filePath}:`, errorMessage)
    process.exit(1)
  }
}

/**
 * Get all locale files
 *
 * @returns {string[]} Array of locale file paths
 */
function getLocaleFiles(): string[] {
  try {
    return fs
      .readdirSync(LOCALES_DIR)
      .filter((file) => file.endsWith('.json'))
      .map((file) => path.join(LOCALES_DIR, file))
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error reading locales directory:`, errorMessage)
    process.exit(1)
  }
}

/**
 * Main function to check translations
 *
 * @returns {void}
 */
function checkTranslations(): void {
  console.log('🔍 Checking translation files...\n')

  const localeFiles = getLocaleFiles()

  if (localeFiles.length === 0) {
    console.log('❌ No locale files found!')
    process.exit(1)
  }

  const referenceFile = localeFiles.find(
    (file) => path.basename(file) === `${REFERENCE_LOCALE}.json`,
  )

  if (!referenceFile) {
    console.log(`❌ Reference file (${REFERENCE_LOCALE}.json) not found!`)
    process.exit(1)
  }

  const referenceTranslations = readJsonFile(referenceFile)
  const referenceKeys = getKeys(referenceTranslations)

  console.log(
    `📚 Reference: ${REFERENCE_LOCALE}.json (${referenceKeys.length} keys)\n`,
  )

  let hasErrors = false

  for (const localeFile of localeFiles) {
    const localeName = path.basename(localeFile, '.json')

    if (localeName === REFERENCE_LOCALE) {
      continue
    }

    const translations = readJsonFile(localeFile)
    const keys = getKeys(translations)
    const missingKeys = referenceKeys.filter((key) => !keys.includes(key))
    const extraKeys = keys.filter((key) => !referenceKeys.includes(key))

    if (missingKeys.length === 0 && extraKeys.length === 0) {
      console.log(
        `✅ ${localeName}.json - All keys present (${keys.length} keys)`,
      )
    } else {
      hasErrors = true
      console.log(`❌ ${localeName}.json - Issues found:`)

      if (missingKeys.length > 0) {
        console.log(`   Missing ${missingKeys.length} key(s):`)
        missingKeys.forEach((key) => {
          console.log(`      - ${key}`)
        })
      }

      if (extraKeys.length > 0) {
        console.log(`   Extra ${extraKeys.length} key(s) (not in reference):`)
        extraKeys.forEach((key) => {
          console.log(`      - ${key}`)
        })
      }
    }

    console.log('')
  }

  if (hasErrors) {
    console.log('❌ Translation check failed! Please fix the issues above.')
    process.exit(1)
  } else {
    console.log('✅ All translation files are in sync!')
    process.exit(0)
  }
}

checkTranslations()
