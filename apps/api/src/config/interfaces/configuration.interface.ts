export interface Configuration {
  // App Version
  appVersion: string

  // Client URL
  clientUrl: string

  // CORS Configuration
  cors: {
    enabled: boolean
    origins: string[]
  }

  // Swagger Configuration
  swagger: {
    enabled: boolean
    title: string
    description: string
    version: string
    path: string
  }

  // JWT Configuration
  jwt: {
    secretOrKey: string
    refreshSecret: string
    expiresIn: number
    refreshExpiresIn: number
  }

  // Room Display JWT Configuration
  roomDisplayJwt: {
    secret: string
  }

  // Email Configuration
  email: {
    host: string
    port: number
    username: string
    password: string
    from: string
  }

  // Throttler Configuration
  throttler: {
    global: {
      limit: number
      ttl: number
    }
    auth: {
      limit: number
      ttl: number
    }
    sensitive: {
      limit: number
      ttl: number
    }
  }
}
