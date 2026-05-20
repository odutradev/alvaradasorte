import { createElement } from 'react'

import { LoginPage } from './login'
import { HomePage } from './home'

import type { AppModule } from '@core/types/module'

export const authModule: AppModule = {
  id: 'auth',
  routes: [
    {
      path: '/login',
      auth: false,
      element: createElement(LoginPage)
    }
  ]
}

export const homeModule: AppModule = {
  id: 'home',
  routes: [
    {
      path: '/',
      auth: true,
      element: createElement(HomePage)
    }
  ]
}