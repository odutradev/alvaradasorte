import { adminModule, authModule, homeModule } from './module'

import type { AppModule } from './types/module'

export const registeredModules: AppModule[] = [authModule, homeModule, adminModule]