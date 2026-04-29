import sharedConfig from '@finiq/prettier-config'

export default {
  ...sharedConfig,
  importOrder: [
    '^(nestjs/(.*)$)|^(nestjs$)$',
    '<THIRD_PARTY_MODULES>',
    '',
    '^(@finiq/shared$)$',
    '^(^@/(.*)$|^@/config/(.*)$|^@/exceptions/(.*)$|^@/filters/(.*)$|^@/helpers/(.*)$|^@/interceptors/(.*)$|^@/modules/(.*)$|^@/providers/(.*)$|^@/templates/(.*)$)',
    '',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
}
