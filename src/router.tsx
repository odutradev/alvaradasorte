import { createBrowserRouter } from 'react-router-dom'
import { createElement } from 'react'

import { SweepstakeDetailsPage } from '@pages/sweepstakeDetails'
import { SweepstakesPage } from '@pages/sweepstakes'
import PresetsPage from '@pages/presets'
import Home from '@pages/home'
import NotFound from '@pages/notFound'
import Login from '@pages/login'

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
  { path: '/', element: createElement(HomePage) },
  ...processProtectedRoutes([
    { path: '/sweepstakes', element: createElement(SweepstakesPage), auth: true },
    { path: '/sweepstakes/:id', element: createElement(SweepstakeDetailsPage), auth: true },
    { path: '/presets', element: createElement(PresetsPage), auth: true }
  ]),
  { path: '*', element: createElement(NotFound) }
])

export default appRouter