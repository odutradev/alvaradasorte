import { createElement } from 'react'

import { LoginPage } from './login'

import type { AppModule } from '@core/types/module'

const authModule: AppModule = {
  id: 'auth',
  routes: [
    {
      path: '/login',
      auth: false,
      element: createElement(LoginPage)
    }
  ]
}

export default authModule