import sharedConfig from '@finiq/prettier-config'

export default {
  ...sharedConfig,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '',
    '^(@finiq/shared$)$',
    '^(^@/(.*)$|^@/constants/(.*)$|^@/enum/(.*)$|^@/types/(.*)$)',
    '',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
}
