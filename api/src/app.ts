import express from 'express'

import { globalRateLimiter } from '@/middlewares/rateLimit'
import registerGlobalRoutes from '@/routes/index'
import configureCors from '@/config/cors'

import type { Application } from 'express'

const buildApp = (): Application => {
  const app = express()

  app.set('trust proxy', 1)
  app.use(globalRateLimiter)
  app.use(configureCors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  registerGlobalRoutes(app)

  return app
}

export default buildApp