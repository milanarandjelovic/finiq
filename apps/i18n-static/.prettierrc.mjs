import sharedConfig from '@finiq/prettier-config'

export default {
  ...sharedConfig,
  importOrder: [
    '^(nestjs/(.*)$)|^(nestjs$)$',
    '<THIRD_PARTY_MODULES>',
    '',
    '^(@finiq/sentry)$',
    '^(@finiq/translations)$',
    '^(^@/(.*)$|^@/config/(.*)$|^@/filters/(.*)$|^@/modules/(.*)$|^@/shared/(.*)$)',
    '',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
}
