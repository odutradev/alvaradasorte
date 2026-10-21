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
import { getLotteryMeta } from '@services/lotteries'
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
  presetId: '',
  lotteryType: '',
  contestNumber: ''
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
    presetId: currentPresetId,
    contestNumber: lottery.nextContestNumber || lottery.contestNumber,
    lotteryType: lottery.type
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
    }
  }, [open, loadPresets])

  useEffect(() => {
    if (!open) {
      setSelectedLottery(null)
      return
    }

    if (initialData) {
      setSelectedLottery(null)
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        quotaPrice: initialData.quotaPrice ?? 30,
        prizeValue: initialData.prizeValue !== undefined ? String(initialData.prizeValue) : '',
        availableQuotas: initialData.availableQuotas ?? 100,
        drawDate: initialData.drawDate ? dayjs(initialData.drawDate).format('YYYY-MM-DDTHH:mm') : '',
        purchaseLimitDate: initialData.purchaseLimitDate ? dayjs(initialData.purchaseLimitDate).format('YYYY-MM-DDTHH:mm') : '',
        presetId: initialData.presetId || '',
        contestNumber: initialData.contestNumber ? String(initialData.contestNumber) : '',
        lotteryType: initialData.lotteryType || ''
      })
    } else if (initialLottery) {
      setSelectedLottery(initialLottery)
      reset(buildValuesFromLottery(initialLottery, getValues('presetId') || ''))
    } else {
      setSelectedLottery(null)
      reset({
        ...DEFAULT_VALUES,
        presetId: getValues('presetId') || ''
      })
    }
  }, [open, initialData?.id, initialLottery, reset])

  const handleApplyLottery = (lottery: LotteryItemResponse) => {
    setSelectedLottery(lottery)
    const currentPresetId = getValues('presetId')
    const filled = buildValuesFromLottery(lottery, currentPresetId)
    setValue('title', filled.title)
    setValue('description', filled.description)
    setValue('prizeValue', filled.prizeValue)
    if (filled.drawDate) setValue('drawDate', filled.drawDate)
    if (filled.purchaseLimitDate) setValue('purchaseLimitDate', filled.purchaseLimitDate)
    setValue('contestNumber', filled.contestNumber)
    setValue('lotteryType', filled.lotteryType)
  }

  const onSubmit = async (data: SweepstakeFormData) => {
    const { contestNumber: rawContestNumber, lotteryType: rawLotteryType, ...restData } = data
    const contestNumber = rawContestNumber ? Number(rawContestNumber) : undefined
    const lotteryType = rawLotteryType ? String(rawLotteryType).trim() : undefined

    const payload = {
      ...restData,
      purchaseLimitDate: new Date(data.purchaseLimitDate).toISOString(),
      availableQuotas: Number(data.availableQuotas),
      drawDate: new Date(data.drawDate).toISOString(),
      prizeValue: Number(data.prizeValue),
      quotaPrice: Number(data.quotaPrice),
      ...(contestNumber ? { contestNumber } : {}),
      ...(lotteryType ? { lotteryType } : {})
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 0.5 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<CasinoIcon />}
              onClick={() => setLotteryModalOpen(true)}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
            >
              Buscar dados da Caixa Econômica
            </Button>
          </Box>
          <DateRow>
            <Controller
              name="lotteryType"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  select
                  label="Modalidade da Loteria"
                  fullWidth
                >
                  <MenuItem value="">Nenhuma / Personalizado</MenuItem>
                  <MenuItem value="megasena">Mega-Sena</MenuItem>
                  <MenuItem value="lotofacil">Lotofácil</MenuItem>
                  <MenuItem value="quina">Quina</MenuItem>
                  <MenuItem value="lotomania">Lotomania</MenuItem>
                  <MenuItem value="duplasena">Dupla Sena</MenuItem>
                  <MenuItem value="timemania">Timemania</MenuItem>
                  <MenuItem value="diadesorte">Dia de Sorte</MenuItem>
                  <MenuItem value="maismilionaria">+Milionária</MenuItem>
                  <MenuItem value="federal">Loteria Federal</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="contestNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label="Número do Concurso"
                  type="number"
                  placeholder="Ex: 3073"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </DateRow>

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