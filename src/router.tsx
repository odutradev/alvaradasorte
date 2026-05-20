import { createBrowserRouter } from 'react-router-dom'
import { createElement } from 'react'

import { adminModule } from '@pages/admin'
import NotFound from '@pages/notFound'
import { LoginPage } from '@pages/login'
import { HomePage } from '@pages/home'

import type { RouteObject } from 'react-router-dom'
import type { AppRoute } from '@appTypes/module'

const processAdminRoutes = (routes: AppRoute[]): RouteObject[] =>
  routes.map(({ permissionCodes, children, global, auth, ...rest }) => {
    const route: RouteObject = auth && rest.element ? { ...rest, element: <>{rest.element}</> } : { ...rest }
    if (children) route.children = processAdminRoutes(children)
    return route
  })

export const appRouter = createBrowserRouter([
  { path: '/login', element: createElement(LoginPage) },
  { path: '/', element: createElement(HomePage) },
  ...processAdminRoutes(adminModule.routes ?? []),
  { path: '*', element: createElement(NotFound) }
])