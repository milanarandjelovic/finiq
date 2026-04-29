import { config } from "@finiq/eslint-config/react-internal";

export default [
  ...config,
  {
    ignores: ["dist/**", ".expo/**", "node_modules/**"],
  },
];
