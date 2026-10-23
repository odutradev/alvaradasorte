import { Router } from 'express'

import { syncAuthUser, updateMe, getMe } from '@/actions/auth/index'
import authMiddleware from '@/middlewares/auth'

const authRoutes = Router()

authRoutes.post('/sync', syncAuthUser)
authRoutes.get('/me', authMiddleware, getMe)
authRoutes.patch('/me', authMiddleware, updateMe)

export default authRoutes
