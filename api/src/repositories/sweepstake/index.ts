import participationRepository from '@/repositories/participation/index'
import { firebaseDb } from '@/database/connection'

import type { CreateSweepstakePayload, UpdateSweepstakePayload, SweepstakeType } from './types'

const REF_PATH = 'sweepstakes'

const sweepstakeRepository = {
  findAll: async (): Promise<SweepstakeType[]> => {
    const snapshot = await firebaseDb.ref(REF_PATH).once('value')
    const data = snapshot.val() as Record<string, SweepstakeType> | null

    if (!data) return []

    return Object.entries(data).map(([id, item]) => ({ ...item, id }))
  },
  findById: async (id: string): Promise<SweepstakeType | null> => {
    const snapshot = await firebaseDb.ref(`${REF_PATH}/${id}`).once('value')

    if (!snapshot.exists()) return null

    return snapshot.val() as SweepstakeType
  },
  create: async (data: CreateSweepstakePayload): Promise<SweepstakeType> => {
    const ref = firebaseDb.ref(REF_PATH).push()
    const id = ref.key as string
    const now = new Date().toISOString()
    const payload = { ...data, filledQuotas: 0, id, createdAt: now, updatedAt: now }

    await ref.set(payload)

    return payload
  },
  syncFilledQuotas: async (id: string): Promise<number> => {
    const participations = await participationRepository.findBySweepstakeId(id)
    const total = participations.reduce((acc, p) => acc + (p.quotaCount ?? 1), 0)
    await firebaseDb.ref(`${REF_PATH}/${id}/filledQuotas`).set(total)
    return total
  },
  reserveQuotas: async (
    id: string,
    count: number
  ): Promise<{
    success: boolean
    reason?: 'not_found' | 'insufficient_quotas' | 'already_closed'
    remainingQuotas?: number
    sweepstake?: SweepstakeType
  }> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    let failureReason: 'not_found' | 'insufficient_quotas' | 'already_closed' | undefined
    let calculatedRemaining = 0
    let updatedSweepstake: SweepstakeType | undefined

    const result = await ref.transaction((current: SweepstakeType | null) => {
      if (!current) {
        return current
      }

      if (current.purchaseLimitDate && new Date(current.purchaseLimitDate).getTime() < Date.now()) {
        failureReason = 'already_closed'
        return undefined
      }

      const currentFilled = current.filledQuotas ?? 0
      const available = current.availableQuotas ?? 0
      const remaining = available - currentFilled
      calculatedRemaining = remaining

      if (count > remaining) {
        failureReason = 'insufficient_quotas'
        return undefined
      }

      current.filledQuotas = currentFilled + count
      current.updatedAt = new Date().toISOString()
      updatedSweepstake = { ...current, id }
      return current
    }, undefined, false)

    if (!result.snapshot.exists()) {
      return {
        success: false,
        reason: 'not_found',
        remainingQuotas: 0
      }
    }

    if (!result.committed) {
      return {
        success: false,
        reason: failureReason ?? 'insufficient_quotas',
        remainingQuotas: calculatedRemaining
      }
    }

    return {
      success: true,
      sweepstake: updatedSweepstake ?? (result.snapshot.val() as SweepstakeType),
      remainingQuotas: calculatedRemaining - count
    }
  },
  adjustFilledQuotas: async (id: string, diff: number): Promise<void> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    await ref.transaction((current: SweepstakeType | null) => {
      if (!current) return current
      const currentFilled = current.filledQuotas ?? 0
      current.filledQuotas = Math.max(0, currentFilled + diff)
      current.updatedAt = new Date().toISOString()
      return current
    }, undefined, false)
  },
  update: async (id: string, data: UpdateSweepstakePayload): Promise<SweepstakeType | null> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')

    if (!snapshot.exists()) return null

    const now = new Date().toISOString()
    const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
    const merged = { ...snapshot.val(), ...cleanData, updatedAt: now }

    await ref.set(merged)

    return merged as SweepstakeType
  },
  delete: async (id: string): Promise<boolean> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')

    if (!snapshot.exists()) return false

    await participationRepository.deleteBySweepstakeId(id)
    await ref.remove()

    return true
  }
}

export default sweepstakeRepository
