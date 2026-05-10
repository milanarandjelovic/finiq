# `@finiq/translations`

Shared translation files for the Conference Booking application.

## Structure

```
src/
├── index.ts              # Main export file
└── locales/
    ├── en.json          # English translations
    └── sr.json          # Serbian translations
```

## Supported Languages

- `en` - English (default)
- `sr` - Serbian

## Translation Format

All translation files use a 2-level nested JSON structure:

```json
{
  "category": {
    "key": "Translation value"
  }
}
```

Example:

```json
{
  "auth": {
    "loginTitle": "Sign In",
    "loginEmail": "Email"
  }
}
```

## Usage

### Import All Translations

```typescript
import { defaultLocale, locales, translations } from '@finiq/translations'

console.log(translations.en.auth.loginTitle) // "Sign In"
console.log(translations.sr.auth.loginTitle) // "Prijavi se"
```

### Import Individual Locales

```typescript
import { en, sr } from '@finiq/translations'

console.log(en.common.welcome) // "Welcome"
console.log(sr.common.welcome) // "Dobrodošli"
```

### In Vue 3 (with vue-i18n)

```typescript
import { defaultLocale, translations } from '@finiq/translations'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages: translations,
})

export default i18n
```

## Checking Translations

Before committing changes, always run the translation check script to ensure all locale files are in sync:

```bash
pnpm run check-translations
```

This script will:

- Compare all locale files against the reference (en.json)
- Report missing keys in each locale
- Report extra keys that don't exist in the reference
- Exit with an error if any issues are found

Example output:

```
🔍 Checking translation files...

📚 Reference: en.json (80 keys)

✅ sr.json - All keys present (80 keys)

✅ All translation files are in sync!
```

## Adding New Translations

1. Add the new key-value pair to all locale files (en.json, sr.json)
2. Keep the structure consistent across all files
3. Use 2-level nesting maximum: `category.key`
4. Use camelCase for keys (e.g., `loginTitle`, `formEmail`)
5. Run `pnpm run check-translations` to verify all keys are present

## Interpolation

For dynamic values, use the `{variableName}` syntax:

```json
{
  "validation": {
    "minLength": "Must be at least {min} characters"
  }
}
```

Usage in your i18n library:

```typescript
t('validation.minLength', { min: 8 }) // "Must be at least 8 characters"
```
