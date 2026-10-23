import express from 'express'

import registerGlobalRoutes from '@/routes/index'
import configureCors from '@/config/cors'

import type { Application } from 'express'

const buildApp = (): Application => {
  const app = express()

  app.use(configureCors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  registerGlobalRoutes(app)

  return app
}

export default buildApp