import sharedConfig from "@finiq/prettier-config";

export default {
  ...sharedConfig,
  importOrder: [
    '^(react/(.*)$)|^(react$)$',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^(@finiq/ui$)|^(@finiq/ui/(.*)$)',
    '^(^@ui/(.*)$)',
    '^(^@/(.*)$|^@/components/(.*)$|^@/lib/(.*)$)',
    '',
    '^[../]',
    '^[./]',
  ],
}
