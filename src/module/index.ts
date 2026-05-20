import { createElement } from 'react'

import { adminModule } from './admin'
import { LoginPage } from './login'
import { HomePage } from './home'

import type { AppModule } from '@core/types/module'

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