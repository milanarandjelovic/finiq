import { useQuery } from '@tanstack/react-query'

import { Env } from '@/util/env'

export function useAvailableLanguages() {
  return useQuery({
    queryKey: ['available-languages'],
    queryFn: async () => {
      const response = await fetch(`${Env.i18nUrl}/locales`)

      if (!response.ok) {
        throw new Error('Failed to fetch available languages')
      }

      return response.json() as Promise<string[]>
    },
  })
}
