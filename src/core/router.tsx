import { createBrowserRouter, Navigate } from 'react-router-dom'

import NotFound from '@core/pages/notFound'
import { registeredModules } from '@core/registry'

import type { RouteObject } from 'react-router-dom'
import type { AppRoute } from '@core/types/module'

const processRoutes = (routes: AppRoute[]): RouteObject[] => {
  return routes.map((route) => {
    const { permissionCodes, children, global, auth, ...rest } = route
    const processedRoute: RouteObject = { ...rest }
    if (auth && route.element) {
      processedRoute.element = (
        < >
          {route.element}
        </>
      )
    }
    if (children) processedRoute.children = processRoutes(children)
    return processedRoute
  })
}

const buildAppRoutes = (): RouteObject[] => {
  const moduleRoutes = registeredModules.reduce<RouteObject[]>((acc, mod) => {
    if (!mod.routes) return acc
    return [...acc, ...processRoutes(mod.routes)]
  }, [])

  return [
    {
      path: '/',
      element: <Navigate to="/iam/profile" replace />
    },
    ...moduleRoutes,
    {
      path: '*',
      element: <NotFound />
    }
  ]
}

export const appRouter = createBrowserRouter(buildAppRoutes())