import { DialogContent, DialogActions, DialogTitle, TextField, MenuItem, Button, Dialog } from '@mui/material'
import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { createSweepstake } from '@services/sweepstakes'
import { getPresets } from '@services/presets'
import useAction from '@hooks/useAction'
import * as S from './styles'

import type { SweepstakeFormModalProps, SweepstakeFormData } from './types'
import type { PresetResponse } from '@services/presets/types'

export const SweepstakeFormModal = ({ onSuccess, onClose, open }: SweepstakeFormModalProps) => {
  const [presets, setPresets] = useState<PresetResponse[]>([])
  const { handleSubmit, register, reset } = useForm<SweepstakeFormData>()

  const loadPresets = useCallback(async () => {
    await useAction({
      action: async () => await getPresets(),
      callback: (data) => setPresets(data),
      silent: true
    })
  }, [])

  useEffect(() => {
    if (open) loadPresets()
  }, [open, loadPresets])

  const onSubmit = async (data: SweepstakeFormData) => {
    const payload = {
      ...data,
      purchaseLimitDate: new Date(data.purchaseLimitDate).toISOString(),
      availableQuotas: Number(data.availableQuotas),
      drawDate: new Date(data.drawDate).toISOString(),
      prizeValue: Number(data.prizeValue),
      quotaPrice: Number(data.quotaPrice)
    }
    await useAction({
      action: async () => await createSweepstake(payload),
      callback: () => {
        onSuccess()
        onClose()
        reset()
      },
      toastMessages: { success: 'Bolão criado!', pending: 'Salvando...', error: 'Erro ao criar' }
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Novo Bolão</DialogTitle>
      <DialogContent>
        <S.FormContainer component="form" id="sweepstake-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField {...register('title')} label="Título" required fullWidth />
          <TextField {...register('quotaPrice')} label="Valor da Cota (R$)" type="number" required fullWidth />
          <TextField {...register('prizeValue')} label="Valor do Prêmio (R$)" type="number" required fullWidth />
          <TextField {...register('availableQuotas')} label="Quantidade de Cotas" type="number" required fullWidth />
          <TextField {...register('drawDate')} label="Data do Sorteio" type="datetime-local" InputLabelProps={{ shrink: true }} required fullWidth />
          <TextField {...register('purchaseLimitDate')} label="Limite de Compra" type="datetime-local" InputLabelProps={{ shrink: true }} required fullWidth />
          <TextField {...register('presetId')} select label="Conta Recebedora" defaultValue="" required fullWidth>
            {presets.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.description} ({p.bank})</MenuItem>
            ))}
          </TextField>
        </S.FormContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button type="submit" form="sweepstake-form" variant="contained" color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  )
}