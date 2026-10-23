import { Router } from 'express'

import { getLotteryByType, listLotteries } from '@/actions/lottery/index'
import adminMiddleware from '@/middlewares/admin'
import authMiddleware from '@/middlewares/auth'

const lotteriesRoutes = Router()

lotteriesRoutes.use(authMiddleware, adminMiddleware)

lotteriesRoutes.get('/', listLotteries)
lotteriesRoutes.get('/:type', getLotteryByType)

export default lotteriesRoutes
