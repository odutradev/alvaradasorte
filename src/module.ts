import { createElement } from 'react'

import { adminModule } from './pages/admin'
import { LoginPage } from './pages/login'
import { HomePage } from './pages/home'

import type { AppModule } from './types/module'

export const authModule: AppModule = {
  id: 'auth',
  routes: [
    {
      path: '/login',
      element: createElement(LoginPage),
      auth: false
    }
  ]
}

export const homeModule: AppModule = {
  id: 'home',
  routes: [
    {
      path: '/',
      element: createElement(HomePage),
      auth: true
    }
  ]
}

export { adminModule }