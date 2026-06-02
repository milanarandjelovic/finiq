import { Client } from 'pg'

function createClient() {
  return new Client({
    host: process.env.DATASOURCE_HOST ?? '127.0.0.1',
    port: Number(process.env.DATASOURCE_PORT ?? 5432),
    database: process.env.DATASOURCE_DATABASE ?? 'finiq',
    user: process.env.DATASOURCE_USERNAME ?? 'root',
    password: process.env.DATASOURCE_PASSWORD ?? 'password',
  })
}

export async function getEmailVerificationToken(
  email: string,
): Promise<string> {
  const client = createClient()
  await client.connect()
  try {
    const result = await client.query<{ token: string }>(
      `SELECT ev.token
         FROM email_verifications ev
         JOIN users u ON u.id = ev.user_id
        WHERE u.email = $1
        LIMIT 1`,
      [email],
    )
    if (!result.rows.length) {
      throw new Error(`No verification token found for ${email}`)
    }
    return result.rows[0]!.token
  } finally {
    await client.end()
  }
}
