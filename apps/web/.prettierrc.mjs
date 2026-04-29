import sharedConfig from '@finiq/prettier-config';

export default {
  ...sharedConfig,
  importOrder: [
    '^(react/(.*)$)|^(react$)$',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^(@finiq/hooks)',
    '^(@finiq/schemas)',
    '^(@finiq/shared)',
    '^(@finiq/ui$)|^(@finiq/ui/(.*)$)',
    '^(^@/(.*)$|^@/api/(.*)$|^@/app/(.*)$|^@/assets/(.*)$|^@/components/(.*)$|^@/constants/(.*)$|^@/context/(.*)$|^@/hooks/(.*)$|^@/lib/(.*)$|^@/types/(.*)$)',
    '',
    '^[../]',
    '^[./]',
  ],
}
