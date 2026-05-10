#!/usr/bin/env node

/**
 * Script to find translation keys used in the codebase that don't exist in en.json
 * Scans specified projects for translation key usage and compares against the reference locale
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONFIG = {
  referenceLocale: path.join(__dirname, '../locales/en.json'),

  projects: [
    {
      name: 'web',
      path: path.join(__dirname, '../../../../apps/web'),
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      exclude: ['node_modules', 'dist', 'build', '.git', 'coverage', '.next'],
    },
  ],

  // Regex patterns to find translation keys
  // Captures keys from patterns like: t('key.path'), $t('key.path'), i18n.t('key.path')
  patterns: [
    /\bt\s*\(\s*['"`]([^'"`]+)['"`]/g, // t('key.path')
    /\$t\s*\(\s*['"`]([^'"`]+)['"`]/g, // $t('key.path')
    /i18n\.t\s*\(\s*['"`]([^'"`]+)['"`]/g, // i18n.t('key.path')
  ],
}

interface TranslationObject {
  [key: string]: string | TranslationObject
}

interface ScanResult {
  projectName: string
  filePath: string
  lineNumber: number
  key: string
}

/**
 * Get all keys from a nested object as dot-notation paths
 *
 * @param {TranslationObject} obj - Nested object
 * @param {string} [prefix=''] - Optional prefix to prepend to keys
 * @returns {Set<string>} Set of keys
 */
function getKeys(obj: TranslationObject, prefix = ''): Set<string> {
  const keys = new Set<string>()

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedKeys = getKeys(value, fullKey)
      nestedKeys.forEach((k) => keys.add(k))
    } else {
      keys.add(fullKey)
    }
  }

  return keys
}

/**
 * Read and parse the reference locale JSON file
 *
 * @param {string} filePath - Path to JSON file
 * @returns {Set<string>} Set of translation keys
 */
function readReferenceLocale(filePath: string): Set<string> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const translations = JSON.parse(content) as TranslationObject

    return getKeys(translations)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ Error reading reference locale:`, errorMessage)

    process.exit(1)
  }
}

/**
 * Check if a path should be excluded
 *
 * @param {string} filePath - Path to file
 * @param {string[]} excludeDirs - Directories to exclude
 * @returns {boolean} True if the path should be excluded, false if not
 */
function shouldExclude(filePath: string, excludeDirs: string[]): boolean {
  const pathParts = filePath.split(path.sep)

  return excludeDirs.some((dir) => pathParts.includes(dir))
}

/**
 * Recursively get all files with specified extensions
 *
 * @param {string} dir - Directory to scan
 * @param {string[]} extensions - File extensions to include
 * @param {string[]} excludeDirs - Directories to exclude
 * @returns {string[]} Array of file paths
 */
function getFiles(
  dir: string,
  extensions: string[],
  exclude: string[],
): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`)
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (shouldExclude(fullPath, exclude)) {
      continue
    }

    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath, extensions, exclude))
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name)

      if (extensions.includes(ext)) {
        files.push(fullPath)
      }
    }
  }

  return files
}

/**
 * Extract translation keys from file content
 *
 * @param {string} content - File content
 * @param {string} filePath - Path to file
 * @param {string} projectName - Name of the project the file belongs to
 * @returns {ScanResult[]} Array of scan results
 */
function extractKeysFromContent(
  content: string,
  filePath: string,
  projectName: string,
): ScanResult[] {
  const results: ScanResult[] = []
  const lines = content.split('\n')

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]

    if (!line) continue

    for (const pattern of CONFIG.patterns) {
      pattern.lastIndex = 0
      let match

      while ((match = pattern.exec(line)) !== null) {
        const key = match[1]
        if (key && key.trim()) {
          results.push({
            projectName,
            filePath,
            lineNumber: lineIndex + 1,
            key: key.trim(),
          })
        }
      }
    }
  }

  return results
}

/**
 * Scan a project for translation key usage
 *
 * @param {typeof CONFIG.projects[0]} projectConfig - Project configuration
 * @returns {ScanResult[]} Array of scan results
 */
function scanProject(projectConfig: (typeof CONFIG.projects)[0]): ScanResult[] {
  console.log(`\n🔍 Scanning project: ${projectConfig.name}`)
  console.log(`   Path: ${projectConfig.path}`)

  const files = getFiles(
    projectConfig.path,
    projectConfig.extensions,
    projectConfig.exclude,
  )

  console.log(`   Found ${files.length} files to scan`)

  const allResults: ScanResult[] = []

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8')
      const results = extractKeysFromContent(content, file, projectConfig.name)
      allResults.push(...results)
    } catch (error) {
      console.warn(`   ⚠️  Error reading file ${file}:`, error)
    }
  }

  return allResults
}

/**
 * Group results by key
 *
 * @param {ScanResult[]} results - Array of scan results
 * @returns {Map<string, ScanResult[]>} Map of keys to usages
 */
function groupByKey(results: ScanResult[]): Map<string, ScanResult[]> {
  const grouped = new Map<string, ScanResult[]>()

  for (const result of results) {
    const existing = grouped.get(result.key) || []
    existing.push(result)
    grouped.set(result.key, existing)
  }

  return grouped
}

/**
 * Main function
 *
 * @returns {void}
 */
function main(): void {
  console.log('🌐 Translation Key Validator')
  console.log('='.repeat(50))

  console.log(`\n📚 Loading reference locale: ${CONFIG.referenceLocale}`)
  const referenceKeys = readReferenceLocale(CONFIG.referenceLocale)
  console.log(`   Found ${referenceKeys.size} translation keys`)

  const allResults: ScanResult[] = []
  for (const project of CONFIG.projects) {
    const results = scanProject(project)
    allResults.push(...results)
  }

  const groupedResults = groupByKey(allResults)
  console.log(`\n📊 Total unique keys found in code: ${groupedResults.size}`)

  const missingKeys = new Map<string, ScanResult[]>()

  for (const [key, usages] of groupedResults.entries()) {
    // For dynamic keys (e.g. `entityStatus.${status}`), validate that the static
    // prefix matches at least one key in the reference locale
    if (key.includes('${')) {
      const staticPrefix = key.substring(0, key.indexOf('${'))
      const hasMatchingPrefix = [...referenceKeys].some((refKey) =>
        refKey.startsWith(staticPrefix),
      )

      if (!hasMatchingPrefix) {
        missingKeys.set(key, usages)
      }

      continue
    }

    if (!referenceKeys.has(key)) {
      missingKeys.set(key, usages)
    }
  }

  console.log('\n' + '='.repeat(50))

  if (missingKeys.size === 0) {
    console.log('\n✅ Success! All translation keys exist in en.json')
    console.log(`   Scanned ${groupedResults.size} unique keys`)
    process.exit(0)
  }

  console.log(`\n❌ Found ${missingKeys.size} missing translation key(s):\n`)

  const sortedMissingKeys = Array.from(missingKeys.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  )

  for (const [key, usages] of sortedMissingKeys) {
    console.log(`🔑 "${key}" (used ${usages.length} time(s))`)

    const displayUsages = usages.slice(0, 3)

    for (const usage of displayUsages) {
      const relativePath = path.relative(process.cwd(), usage.filePath)
      console.log(`   └─ ${relativePath}:${usage.lineNumber}`)
    }

    if (usages.length > 3) {
      console.log(`   └─ ... and ${usages.length - 3} more usage(s)`)
    }

    console.log('')
  }

  console.log('='.repeat(50))
  console.log(
    '\n💡 Tip: Add the missing keys to en.json with appropriate translations',
  )

  process.exit(1)
}

main()
