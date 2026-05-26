import { createBrowserRouter } from 'react-router-dom'
import { createElement } from 'react'

import { SweepstakeDetailsPage } from '@pages/sweepstakeDetails'
import Sweepstakes from '@pages/sweepstakes'
import NotFound from '@pages/notFound'
import Presets from '@pages/presets'
import Login from '@pages/login'
import Home from '@pages/home'

import type { RouteObject } from 'react-router-dom'
import type { AppRoute } from '@appTypes/module'

const processProtectedRoutes = (routes: AppRoute[]): RouteObject[] =>
  routes.map(({ permissionCodes, children, global, auth, ...rest }) => {
    const route: RouteObject = auth && rest.element ? { ...rest, element: <>{rest.element}</> } : { ...rest }
    if (children) route.children = processProtectedRoutes(children)
    return route
  })

const appRouter = createBrowserRouter([
  { path: '/login', element: createElement(Login) },
  { path: '/', element: createElement(Home) },
  ...processProtectedRoutes([
    { path: '/sweepstakes', element: createElement(Sweepstakes), auth: true },
    { path: '/sweepstakes/:id', element: createElement(SweepstakeDetailsPage), auth: true },
    { path: '/presets', element: createElement(Presets), auth: true }
  ]),
  { path: '*', element: createElement(NotFound) }
])

export default appRouter
