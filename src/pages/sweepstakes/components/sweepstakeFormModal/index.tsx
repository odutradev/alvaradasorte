import { DialogActions, TextField, MenuItem, Button, Dialog, Box } from '@mui/material'
import { useEffect, useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { createSweepstake } from '@services/sweepstakes'
import { FormContainer, DateRow } from './styles'
import ValueSlider from '@components/valueSlider'
import { getPresets } from '@services/presets'
import useAction from '@hooks/useAction'

import type { SweepstakeFormModalProps, SweepstakeFormData } from './types'
import type { PresetResponse } from '@services/presets/types'

export const SweepstakeFormModal = ({ onSuccess, onClose, open }: SweepstakeFormModalProps) => {
  const [presets, setPresets] = useState<PresetResponse[]>([])

  const { handleSubmit, register, control, reset } = useForm<SweepstakeFormData>({
    defaultValues: {
      title: '',
      description: '',
      quotaPrice: 10,
      prizeValue: '',
      availableQuotas: 100,
      drawDate: '',
      purchaseLimitDate: '',
      presetId: ''
    }
  })

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <FormContainer component="form" id="sweepstake-form" onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register('title')} label="Título" required fullWidth />
        <TextField {...register('description')} label="Descrição" required fullWidth multiline rows={3} />
        <Controller
          name="quotaPrice"
          control={control}
          render={({ field }) => (
            <ValueSlider
              label="Valor da Cota"
              value={field.value}
              onChange={field.onChange}
              min={5}
              max={150}
              format="currency"
              markStep={5}
            />
          )}
        />
        <TextField {...register('prizeValue')} label="Valor do Prêmio (R$)" type="number" required fullWidth />
        <Controller
          name="availableQuotas"
          control={control}
          render={({ field }) => (
            <ValueSlider
              label="Quantidade de Cotas"
              value={field.value}
              onChange={field.onChange}
              min={10}
              max={100}
              format="number"
              markStep={5}
            />
          )}
        />
        <DateRow>
          <TextField {...register('drawDate')} label="Data do Sorteio" type="datetime-local" InputLabelProps={{ shrink: true }} required fullWidth />
          <TextField {...register('purchaseLimitDate')} label="Limite de Compra" type="datetime-local" InputLabelProps={{ shrink: true }} required fullWidth />
        </DateRow>
        <TextField {...register('presetId')} select label="Conta Recebedora" defaultValue="" required fullWidth>
          {presets.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.receiverName} ({p.bank})</MenuItem>
          ))}
        </TextField>
      </FormContainer>
      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button type="submit" form="sweepstake-form" variant="contained" color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  )
}