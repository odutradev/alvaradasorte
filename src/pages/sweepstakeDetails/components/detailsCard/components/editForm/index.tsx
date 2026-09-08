import { TextField, MenuItem, Button } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { FormContainer, DateRow, ActionsRow } from './styles'
import { updateSweepstake } from '@services/sweepstakes'
import ValueSlider from '@components/valueSlider'
import useAction from '@hooks/useAction'

import type { EditFormProps, SweepstakeEditFormData } from './types'

const EditForm = ({ data, presets, onSuccess, onCancel }: EditFormProps) => {
  const { handleSubmit, register, control } = useForm<SweepstakeEditFormData>({
    defaultValues: {
      title: data.title,
      description: data.description,
      quotaPrice: data.quotaPrice,
      prizeValue: String(data.prizeValue),
      availableQuotas: data.availableQuotas,
      drawDate: dayjs(data.drawDate).format('YYYY-MM-DDTHH:mm'),
      purchaseLimitDate: dayjs(data.purchaseLimitDate).format('YYYY-MM-DDTHH:mm'),
      presetId: data.presetId
    }
  })

  const onSubmit = async (formData: SweepstakeEditFormData) => {
    const payload = {
      ...formData,
      purchaseLimitDate: new Date(formData.purchaseLimitDate).toISOString(),
      availableQuotas: Number(formData.availableQuotas),
      drawDate: new Date(formData.drawDate).toISOString(),
      prizeValue: Number(formData.prizeValue),
      quotaPrice: Number(formData.quotaPrice)
    }

    await useAction({
      action: async () => await updateSweepstake(data.id, payload),
      callback: async () => {
        await onSuccess()
        onCancel()
      },
      toastMessages: {
        success: 'Bolão atualizado com sucesso!',
        pending: 'Salvando alterações...',
        error: 'Erro ao atualizar bolão'
      }
    })
  }

  return (
    <FormContainer component="form" onSubmit={handleSubmit(onSubmit)}>
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
        <TextField
          {...register('drawDate')}
          label="Data do Sorteio"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
        <TextField
          {...register('purchaseLimitDate')}
          label="Limite de Compra"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />
      </DateRow>
      <TextField
        {...register('presetId')}
        select
        label="Conta Recebedora"
        defaultValue={data.presetId}
        required
        fullWidth
      >
        {presets.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.receiverName} ({p.bank})
          </MenuItem>
        ))}
      </TextField>
      <ActionsRow>
        <Button onClick={onCancel} color="inherit" variant="outlined">
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Salvar Alterações
        </Button>
      </ActionsRow>
    </FormContainer>
  )
}

export default EditForm
