import { createElement } from 'react'

import { SweepstakesAdminPage } from './sweepstakes'
import { PresetsAdminPage } from './presets'

import type { AppModule } from '@core/types/module'

export const adminModule: AppModule = {
  id: 'admin',
  routes: [
    {
      path: '/admin/sweepstakes',
      element: createElement(SweepstakesAdminPage),
      auth: true
    },
    {
      path: '/admin/presets',
      element: createElement(PresetsAdminPage),
      auth: true
    }
  ]
}