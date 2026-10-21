import { TextField, MenuItem, Button, Box, Chip } from '@mui/material'
import CasinoIcon from '@mui/icons-material/Casino'
import Modal from '@components/modal'
import { useEffect, useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'

import { createSweepstake, updateSweepstake } from '@services/sweepstakes'
import ValueSlider from '@components/valueSlider'
import { getPresets } from '@services/presets'
import useAction from '@hooks/useAction'
import { formatCurrency } from '@utils/string'
import LotterySelectModal from '../lotterySelectModal'
import { FormContainer, DateRow } from './styles'

import type { SweepstakeFormModalProps, SweepstakeFormData } from './types'
import type { PresetResponse } from '@services/presets/types'
import type { LotteryItemResponse } from '@services/lotteries/types'

const DEFAULT_VALUES: SweepstakeFormData = {
  title: '',
  description: '',
  quotaPrice: 30,
  prizeValue: '',
  availableQuotas: 100,
  drawDate: '',
  purchaseLimitDate: '',
  presetId: ''
}

const buildValuesFromLottery = (lottery: LotteryItemResponse, currentPresetId = ''): SweepstakeFormData => {
  const prize = lottery.estimatedPrize || lottery.accumulatedPrize || 0
  const prizeFormatted = formatCurrency(prize)
  const drawDateFormatted = lottery.drawDate ? dayjs(lottery.drawDate).format('YYYY-MM-DDTHH:mm') : ''
  const limitDateFormatted = lottery.drawDate
    ? dayjs(lottery.drawDate).subtract(24, 'hour').format('YYYY-MM-DDTHH:mm')
    : ''

  return {
    title: `${lottery.name} - Concurso ${lottery.nextContestNumber}`,
    description: `Bolão oficial da ${lottery.name}, Concurso ${lottery.nextContestNumber}. Prêmio estimado de ${prizeFormatted}${lottery.isAccumulated ? ' (Acumulado!)' : ''}.`,
    quotaPrice: 30,
    prizeValue: prize ? String(prize) : '',
    availableQuotas: 100,
    drawDate: drawDateFormatted,
    purchaseLimitDate: limitDateFormatted,
    presetId: currentPresetId
  }
}

const SweepstakeFormModal = ({
  onSuccess,
  onClose,
  open,
  initialData,
  initialLottery
}: SweepstakeFormModalProps) => {
  const [presets, setPresets] = useState<PresetResponse[]>([])
  const [lotteryModalOpen, setLotteryModalOpen] = useState(false)
  const [selectedLottery, setSelectedLottery] = useState<LotteryItemResponse | null>(null)

  const { handleSubmit, register, control, reset, setValue, getValues } = useForm<SweepstakeFormData>({
    defaultValues: DEFAULT_VALUES
  })

  const loadPresets = useCallback(async () => {
    await useAction({
      action: async () => await getPresets(),
      callback: (data) => {
        setPresets(data)
        if (!initialData && data.length > 0 && !getValues('presetId')) {
          setValue('presetId', data[0].id)
        }
      },
      silent: true
    })
  }, [initialData, getValues, setValue])

  useEffect(() => {
    if (open) {
      loadPresets()
      const defaultPresetId = presets[0]?.id || ''
      if (initialData) {
        setSelectedLottery(null)
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
      } else if (initialLottery) {
        setSelectedLottery(initialLottery)
        reset(buildValuesFromLottery(initialLottery, defaultPresetId))
      } else {
        setSelectedLottery(null)
        reset({
          ...DEFAULT_VALUES,
          presetId: defaultPresetId
        })
      }
    }
  }, [open, initialData, initialLottery, presets, loadPresets, reset])

  const handleApplyLottery = (lottery: LotteryItemResponse) => {
    setSelectedLottery(lottery)
    const currentPresetId = getValues('presetId')
    const filled = buildValuesFromLottery(lottery, currentPresetId)
    setValue('title', filled.title)
    setValue('description', filled.description)
    setValue('prizeValue', filled.prizeValue)
    if (filled.drawDate) setValue('drawDate', filled.drawDate)
    if (filled.purchaseLimitDate) setValue('purchaseLimitDate', filled.purchaseLimitDate)
  }

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
    <>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<CasinoIcon />}
              onClick={() => setLotteryModalOpen(true)}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
            >
              {selectedLottery ? 'Trocar Loteria da Caixa' : 'Buscar dados da Caixa Econômica'}
            </Button>
            {selectedLottery && (
              <Chip
                label={`Vinculado à ${selectedLottery.name}`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: selectedLottery.color,
                  color: selectedLottery.color,
                  fontWeight: 600
                }}
              />
            )}
          </Box>

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

      <LotterySelectModal
        open={lotteryModalOpen}
        onClose={() => setLotteryModalOpen(false)}
        onSelect={handleApplyLottery}
      />
    </>
  )
}

export default SweepstakeFormModal