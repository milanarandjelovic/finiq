import sharedConfig from '@finiq/prettier-config'

export default {
  ...sharedConfig,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
}
