import { Router } from 'express'

import { listLogs } from '@/actions/log/index'
import authMiddleware from '@/middlewares/auth'

const logsRoutes = Router()

logsRoutes.use(authMiddleware)

logsRoutes.get('/', listLogs)

export default logsRoutes
