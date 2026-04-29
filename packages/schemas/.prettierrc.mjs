import sharedConfig from '@finiq/prettier-config'

export default {
  ...sharedConfig,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '',
    '^(@finiq/shared$)$',
    '^(^@/(.*)$|^@/auth/(.*)$|^@/category/(.*)$|^@/goal/(.*)$|^@/profile/(.*)$|^@/settings/(.*)$|^@/transaction/(.*)$)',
    '',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
}
