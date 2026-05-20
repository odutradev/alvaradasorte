import { authModule, homeModule } from '../module'

import type { AppModule } from '@core/types/module'

export const registeredModules: AppModule[] = [authModule, homeModule]