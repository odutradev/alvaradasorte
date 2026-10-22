import defaultModuleRouter from '@module/routes/index'
import { startAutoResultSyncRoutine } from '@module/services/autoResultSync'

import type { AppModule } from '@core/types/module'

const defaultModule: AppModule = {
  name: 'defaultModule',
  router: defaultModuleRouter,
  routePrefix: '/iam/v1',
  onStartup: async () => {
    startAutoResultSyncRoutine()
  }
}

export default defaultModule