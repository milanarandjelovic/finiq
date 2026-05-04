import { useQuery } from '@tanstack/react-query'

import { Env } from '@/util/env'

export const useAvailableLanguages = () => {
  return useQuery({
    queryKey: ['available-languages'],
    queryFn: async (): Promise<string[]> => {
      const response = await fetch(`${Env.i18nUrl}/locales`)

      if (!response.ok) return ['en']

      return response.json()
    },
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
