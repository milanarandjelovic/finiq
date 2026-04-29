import { join } from 'path'
import * as dotenv from 'dotenv'
import type { DataSourceOptions } from 'typeorm'
import { DataSource as TypeOrmDataSource } from 'typeorm'
import type { SeederOptions } from 'typeorm-extension'

dotenv.config()

const DIST_PATH = join(__dirname, '../..')

export const typeormConfig: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATASOURCE_HOST,
  port: parseInt(`${process.env.DATASOURCE_PORT}`),
  username: process.env.DATASOURCE_USERNAME,
  password: process.env.DATASOURCE_PASSWORD,
  database: process.env.DATASOURCE_DATABASE,
  entities: [join(DIST_PATH, 'modules', '**', '*.entity.{ts,js}')],
  migrations: [join(DIST_PATH, 'providers', 'db', 'migrations', '*.{ts,js}')],
  seeds: [join(DIST_PATH, 'providers', 'db', 'seeders', '*.{ts,js}')],
  factories: [join(DIST_PATH, 'providers', 'db', 'factories', '*.{ts,js}')],
  migrationsRun: true,
  synchronize: false,
  logging: process.env.DATASOURCE_LOGGING === 'true',
  ssl:
    process.env.DATASOURCE_SSL === 'true'
      ? {
          rejectUnauthorized: false,
        }
      : false,
}

export const DataSource = new TypeOrmDataSource(typeormConfig)
