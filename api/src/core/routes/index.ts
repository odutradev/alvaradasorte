import swaggerUi from 'swagger-ui-express'

import { initDocsRegistry, registeredModules } from '@core/registry'
import { generateDocs } from '@core/docs/generator'
import { appConfig } from '@core/config/app'

import type { Application, Response, Request, NextFunction } from 'express'

const ensureTrailingSlash = (req: Request, res: Response, next: NextFunction): void => {
  const forwardedPrefix = ((req.headers['x-forwarded-prefix'] as string) || '').replace(/\/$/, '')
  const pathWithoutQuery = req.originalUrl.split('?')[0]

  if (req.path === '' || req.path === '/') {
    if (!pathWithoutQuery.endsWith('/')) {
      const queryString = req.originalUrl.includes('?') ? `?${req.originalUrl.split('?')[1]}` : ''
      const prefix = forwardedPrefix && !pathWithoutQuery.startsWith(forwardedPrefix) ? forwardedPrefix : ''
      const target = `${prefix}${pathWithoutQuery}/${queryString}`
      res.redirect(301, target)
      return
    }
  }

  next()
}

const registerGlobalRoutes = (app: Application): void => {
  initDocsRegistry()

  app.get(['/health', '/api/health'], (_req: Request, res: Response) => {
    const modules = registeredModules.map((mod) => mod.name)

    res.status(200).json({
      status: 'ok',
      mode: appConfig.mode,
      version: appConfig.version,
      modules
    })
  })

  app.get(['/ping', '/api/ping'], (_req: Request, res: Response) => {
    res.status(200).send('pong')
  })

  const spec = generateDocs()
  const swaggerMiddleware = [
    ensureTrailingSlash,
    ...swaggerUi.serve,
    swaggerUi.setup(spec, { swaggerOptions: { persistAuthorization: true } })
  ]

  app.get(['/docs.json', '/api/docs.json'], (_req: Request, res: Response) => {
    res.status(200).json(spec)
  })

  app.use('/docs', ...swaggerMiddleware)
  app.use('/api/docs', ...swaggerMiddleware)

  registeredModules.forEach((mod) => {
    if (!mod.routePrefix || !mod.router) return

    app.use(mod.routePrefix, mod.router)
    if (!mod.routePrefix.startsWith('/api')) {
      app.use(`/api${mod.routePrefix}`, mod.router)
    }
  })
}

export default registerGlobalRoutes