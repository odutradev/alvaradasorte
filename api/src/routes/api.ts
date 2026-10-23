import { Router } from 'express'

import { sendParticipationResultEmail, updateParticipation, addManualParticipation, deleteParticipation, getSweepstakeDetails, addSweepstakeGames, setSweepstakeResult, updateSweepstake, deleteSweepstake, createSweepstake, listSweepstakes, joinSweepstake } from '@/actions/sweepstake/index'
import { getLotteryByType, listLotteries } from '@/actions/lottery/index'
import { updatePreset, createPreset, deletePreset, listPresets } from '@/actions/preset/index'
import { updateUser, deleteUser, listUsers } from '@/actions/user/index'
import { syncAuthUser, updateMe, getMe } from '@/actions/auth/index'
import { listLogs } from '@/actions/log/index'
import adminMiddleware from '@/middlewares/admin'
import authMiddleware from '@/middlewares/auth'

const apiRouter = Router()

apiRouter.get('/logs', authMiddleware, listLogs)

apiRouter.post('/auth/sync', syncAuthUser)
apiRouter.patch('/auth/me', authMiddleware, updateMe)
apiRouter.get('/auth/me', authMiddleware, getMe)

apiRouter.get('/users', authMiddleware, adminMiddleware, listUsers)
apiRouter.patch('/users/:id', authMiddleware, adminMiddleware, updateUser)
apiRouter.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser)

apiRouter.get('/presets', authMiddleware, adminMiddleware, listPresets)
apiRouter.post('/presets', authMiddleware, adminMiddleware, createPreset)
apiRouter.patch('/presets/:id', authMiddleware, adminMiddleware, updatePreset)
apiRouter.delete('/presets/:id', authMiddleware, adminMiddleware, deletePreset)

apiRouter.get('/sweepstakes', authMiddleware, listSweepstakes)
apiRouter.post('/sweepstakes', authMiddleware, adminMiddleware, createSweepstake)
apiRouter.get('/sweepstakes/:id/details', authMiddleware, adminMiddleware, getSweepstakeDetails)
apiRouter.post('/sweepstakes/:id/join', authMiddleware, joinSweepstake)
apiRouter.post('/sweepstakes/:id/participations/manual', authMiddleware, adminMiddleware, addManualParticipation)
apiRouter.post('/sweepstakes/:id/participations/:participationId/send-result-email', authMiddleware, adminMiddleware, sendParticipationResultEmail)
apiRouter.patch('/sweepstakes/:id/participations/:participationId', authMiddleware, adminMiddleware, updateParticipation)
apiRouter.delete('/sweepstakes/:id/participations/:participationId', authMiddleware, adminMiddleware, deleteParticipation)
apiRouter.patch('/sweepstakes/:id/games', authMiddleware, adminMiddleware, addSweepstakeGames)
apiRouter.patch('/sweepstakes/:id/result', authMiddleware, adminMiddleware, setSweepstakeResult)
apiRouter.patch('/sweepstakes/:id', authMiddleware, adminMiddleware, updateSweepstake)
apiRouter.delete('/sweepstakes/:id', authMiddleware, adminMiddleware, deleteSweepstake)

apiRouter.get('/lotteries', authMiddleware, adminMiddleware, listLotteries)
apiRouter.get('/lotteries/:type', authMiddleware, adminMiddleware, getLotteryByType)

export default apiRouter