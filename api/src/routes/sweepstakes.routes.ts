import { Router } from 'express'

import {
  sendParticipationResultEmail,
  updateParticipation,
  addManualParticipation,
  deleteParticipation,
  getSweepstakeDetails,
  addSweepstakeGames,
  setSweepstakeResult,
  updateSweepstake,
  deleteSweepstake,
  createSweepstake,
  listSweepstakes,
  joinSweepstake
} from '@/actions/sweepstake/index'
import adminMiddleware from '@/middlewares/admin'
import authMiddleware from '@/middlewares/auth'

const sweepstakesRoutes = Router()

sweepstakesRoutes.use(authMiddleware)

sweepstakesRoutes.get('/', listSweepstakes)
sweepstakesRoutes.post('/', adminMiddleware, createSweepstake)
sweepstakesRoutes.get('/:id/details', adminMiddleware, getSweepstakeDetails)
sweepstakesRoutes.post('/:id/join', joinSweepstake)
sweepstakesRoutes.post('/:id/participations/manual', adminMiddleware, addManualParticipation)
sweepstakesRoutes.post('/:id/participations/:participationId/send-result-email', adminMiddleware, sendParticipationResultEmail)
sweepstakesRoutes.patch('/:id/participations/:participationId', adminMiddleware, updateParticipation)
sweepstakesRoutes.delete('/:id/participations/:participationId', adminMiddleware, deleteParticipation)
sweepstakesRoutes.patch('/:id/games', adminMiddleware, addSweepstakeGames)
sweepstakesRoutes.patch('/:id/result', adminMiddleware, setSweepstakeResult)
sweepstakesRoutes.patch('/:id', adminMiddleware, updateSweepstake)
sweepstakesRoutes.delete('/:id', adminMiddleware, deleteSweepstake)

export default sweepstakesRoutes
