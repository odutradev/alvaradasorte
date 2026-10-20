import { TextField, MenuItem, Button } from '@mui/material'
import Modal from '@components/modal'
import { useEffect, useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { createSweepstake, updateSweepstake } from '@services/sweepstakes'
import ValueSlider from '@components/valueSlider'
import { getPresets } from '@services/presets'
import useAction from '@hooks/useAction'
import { FormContainer, DateRow } from './styles'

import type { SweepstakeFormModalProps, SweepstakeFormData } from './types'
import type { PresetResponse } from '@services/presets/types'

const DEFAULT_VALUES: SweepstakeFormData = {
  title: '',
  description: '',
  quotaPrice: 10,
  prizeValue: '',
  availableQuotas: 100,
  drawDate: '',
  purchaseLimitDate: '',
  presetId: ''
}

const SweepstakeFormModal = ({ onSuccess, onClose, open, initialData }: SweepstakeFormModalProps) => {
  const [presets, setPresets] = useState<PresetResponse[]>([])

  const { handleSubmit, register, control, reset } = useForm<SweepstakeFormData>({
    defaultValues: DEFAULT_VALUES
  })

  const loadPresets = useCallback(async () => {
    await useAction({
      action: async () => await getPresets(),
      callback: (data) => setPresets(data),
      silent: true
    })
  }, [])

  useEffect(() => {
    if (open) {
      loadPresets()
      if (initialData) {
        reset({
          title: initialData.title,
          description: initialData.description,
          quotaPrice: initialData.quotaPrice,
          prizeValue: String(initialData.prizeValue),
          availableQuotas: initialData.availableQuotas,
          drawDate: dayjs(initialData.drawDate).format('YYYY-MM-DDTHH:mm'),
          purchaseLimitDate: dayjs(initialData.purchaseLimitDate).format('YYYY-MM-DDTHH:mm'),
          presetId: initialData.presetId
        })
      } else {
        reset(DEFAULT_VALUES)
      }
    }
  }, [open, initialData, loadPresets, reset])

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
      action: async () => {
        if (initialData) {
          return await updateSweepstake(initialData.id, payload)
        }
        return await createSweepstake(payload)
      },
      callback: () => {
        onSuccess()
        onClose()
      },
      toastMessages: {
        success: initialData ? 'Bolão atualizado!' : 'Bolão criado!',
        pending: 'Salvando...',
        error: 'Erro ao salvar'
      }
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={initialData ? 'Editar Bolão' : 'Novo Bolão'}
      subtitle={initialData ? 'Altere as informações do bolão cadastrado' : 'Preencha os dados para criar um novo bolão'}
      formProps={{
        id: 'sweepstake-form',
        onSubmit: handleSubmit(onSubmit)
      }}
      actions={
        <>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">Salvar</Button>
        </>
      }
    >
      <FormContainer>
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
    </Modal>
  )
}

export default SweepstakeFormModal