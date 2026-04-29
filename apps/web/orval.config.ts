import { defineConfig } from 'orval'

import './env-config'

export default defineConfig({
  techsupport: {
    output: {
      mode: 'tags-split',
      target: 'src/api/__generated__/techsupport.ts',
      schemas: 'src/api/__generated__/models',
      client: 'react-query',
      clean: true,
      override: {
        header: false,
        operations: {},
        useDates: true,
        mutator: {
          path: './src/api/axios-instance.ts',
          name: 'axiosInstance',
        },
      },
    },
    input: {
      target: process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`
        : 'http://localhost:4000/swagger.json',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write ./src/api/__generated__/**/*.ts',
    },
  },
})
