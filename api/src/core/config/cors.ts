import cors from 'cors'

import type { RequestHandler } from 'express'
import type { CorsOptions } from 'cors'

const buildCorsOptions = (): CorsOptions => {
  const isProduction = process.env.NODE_ENV === 'production'

  if (!isProduction) return {}

  const originConfig = process.env.CORS_ORIGIN || process.env.CORS_ALLOWED_ORIGINS

  if (!originConfig) return { origin: false }

  if (originConfig === '*') return {}

  const allowedOrigins = originConfig.split(',').map((origin) => origin.trim())

  return {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
  }
}

const configureCors = (): RequestHandler => {
  const options = buildCorsOptions()

  return cors(options)
}

export default configureCors