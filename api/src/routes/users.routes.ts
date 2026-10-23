import { Router } from 'express'

import { updateUser, deleteUser, listUsers } from '@/actions/user/index'
import adminMiddleware from '@/middlewares/admin'
import authMiddleware from '@/middlewares/auth'

const usersRoutes = Router()

usersRoutes.use(authMiddleware, adminMiddleware)

usersRoutes.get('/', listUsers)
usersRoutes.patch('/:id', updateUser)
usersRoutes.delete('/:id', deleteUser)

export default usersRoutes
