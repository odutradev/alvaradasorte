import defineAction from '@/factories/defineAction'
import presetRepository from '@/repositories/preset/index'
import { listPresetsResponseSchema, updatePresetSchema, createPresetSchema, presetParamsSchema, presetSchema } from './schemas'

import type { ManageRequestResponse, ManageRequestBody } from '@/middlewares/manageRequest/types'
import type { UpdatePresetRequest, CreatePresetRequest, ListPresetsResponse, PresetParamsRequest, PresetResponse } from './types'

export const listPresets = defineAction(
  {
    method: 'get',
    path: '/presets',
    summary: 'Listar predefinições (Admin)',
    tags: ['Predefinições'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: listPresetsResponseSchema }
    }
  },
  async ({ manageError }: ManageRequestBody): ManageRequestResponse<ListPresetsResponse> => {
    try {
      const presets = await presetRepository.findAll()

      return presets
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  }
)

export const createPreset = defineAction(
  {
    method: 'post',
    path: '/presets',
    summary: 'Criar predefinição (Admin)',
    tags: ['Predefinições'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: presetSchema }
    }
  },
  async ({ ids, data, manageError }: ManageRequestBody<CreatePresetRequest>): ManageRequestResponse<PresetResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    try {
      const payload = { ...data, adminId: ids.userId }
      const preset = await presetRepository.create(payload)

      return preset
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: createPresetSchema }
)

export const updatePreset = defineAction(
  {
    method: 'patch',
    path: '/presets/{id}',
    summary: 'Atualizar predefinição (Admin)',
    tags: ['Predefinições'],
    authenticate: true,
    responses: {
      200: { description: 'Sucesso', schema: presetSchema }
    }
  },
  async ({ params, data, manageError }: ManageRequestBody<UpdatePresetRequest>): ManageRequestResponse<PresetResponse> => {
    try {
      const preset = await presetRepository.update(params.id, data)

      if (!preset) return manageError({ code: 'not_found' })

      return preset
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: updatePresetSchema, params: presetParamsSchema }
)

export const deletePreset = defineAction(
  {
    method: 'delete',
    path: '/presets/{id}',
    summary: 'Remover predefinição (Admin)',
    tags: ['Predefinições'],
    authenticate: true,
    responses: {
      204: { description: 'Sucesso' }
    }
  },
  async ({ params, manageError }: ManageRequestBody<PresetParamsRequest>): ManageRequestResponse => {
    try {
      const deleted = await presetRepository.delete(params.id)

      if (!deleted) return manageError({ code: 'not_found' })
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  },
  { params: presetParamsSchema }
)


