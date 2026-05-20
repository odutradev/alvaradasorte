import api from '@core/services/api'

import type { ListPresetsResponse, CreatePresetRequest, UpdatePresetRequest, PresetResponse } from './types'

export const getPresets = async (): Promise<ListPresetsResponse> => {
  const response = await api.get<ListPresetsResponse>('/iam/v1/presets')
  return response.data
}

export const createPreset = async (payload: CreatePresetRequest): Promise<PresetResponse> => {
  const response = await api.post<PresetResponse>('/iam/v1/presets', payload)
  return response.data
}

export const updatePreset = async (id: string, payload: UpdatePresetRequest): Promise<PresetResponse> => {
  const response = await api.patch<PresetResponse>(`/iam/v1/presets/${id}`, payload)
  return response.data
}

export const deletePreset = async (id: string): Promise<void> => {
  await api.delete(`/iam/v1/presets/${id}`)
}