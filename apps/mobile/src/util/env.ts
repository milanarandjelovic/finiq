import { z } from 'zod'

const client = z.object({
  apiUrl: z.string().url(),
  i18nUrl: z.string().url(),
  appId: z.string(),
})

const build = z.object({
  env: z.string(),
})

const _clientEnv: Record<keyof z.infer<typeof client>, string | undefined> = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  i18nUrl: process.env.EXPO_PUBLIC_I18N_URL,
  appId: process.env.EXPO_PUBLIC_APP_ID,
}

const _buildEnv: Record<keyof z.infer<typeof build>, string | undefined> = {
  env: process.env.NODE_ENV,
}

const _env = {
  ..._clientEnv,
  ..._buildEnv,
}

const parsed = client.merge(build).safeParse(_env)

if (!parsed.success) {
  console.log(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors,
    `\n❌ Missing variables in .env file, Make sure all required variables are defined in the .env file.`,
    `\n💡 Tip: If you recently updated the .env file and the error still persists, try restarting the server with the -cc flag to clear the cache.`,
  )

  throw new Error(
    'Invalid environment variables, Check terminal for more details ',
  )
}

export const Env = parsed.data
export const ClientEnv = client.parse(_clientEnv)
