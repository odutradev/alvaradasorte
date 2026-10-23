import { Router } from 'express'

import { updatePreset, createPreset, deletePreset, listPresets } from '@/actions/preset/index'
import adminMiddleware from '@/middlewares/admin'
import authMiddleware from '@/middlewares/auth'

const presetsRoutes = Router()

presetsRoutes.use(authMiddleware, adminMiddleware)

presetsRoutes.get('/', listPresets)
presetsRoutes.post('/', createPreset)
presetsRoutes.patch('/:id', updatePreset)
presetsRoutes.delete('/:id', deletePreset)

export default presetsRoutes
