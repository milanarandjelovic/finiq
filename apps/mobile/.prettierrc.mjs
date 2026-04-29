import sharedConfig from "@finiq/prettier-config";

export default {
  ...sharedConfig,
  importOrder: [
    "^(react/(.*)$)|^(react$)$",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^(@finiq/hooks)$",
    "^(@finiq/schemas)$",
    "^(@finiq/shared$)$",
    "^(^@/(.*)$|^@/app/(.*)$|^@/assets/(.*)$|^@/components/(.*)$|^@/constants/(.*)$|^@/hooks/(.*)$|^@/i18n/(.*)$|^@/network/(.*)$|^@/providers/(.*)$|^@/types/(.*)$|^@/util/(.*)$|^@/views/(.*)$)",
    "",
    "^[../]",
    "^[./]",
  ],
};
