import { Typography, IconButton, TextField, Button, Switch, Box, Chip } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { useForm } from 'react-hook-form'
import { useState, useMemo } from 'react'

import {
  FileUploadBox,
  FormContainer,
  InstructionBox,
  FileStatusRow,
  QuantityContainer,
  QuantityControl,
  TotalSummaryBox,
  SuggestionToggleBox
} from './styles'
import { NumberGrid, NumberBall } from '@pages/sweepstakeDetails/components/gamesModal/styles'
import { getLotteryRule } from '@utils/lotteryRules'
import { getLotteryMeta } from '@services/lotteries'
import { joinSweepstake } from '@services/sweepstakes'
import { formatCurrency } from '@utils/string'
import useAction from '@hooks/useAction'
import Modal from '@components/modal'

import type { JoinSweepstakeModalProps, JoinFormData } from './types'

const JoinSweepstakeModal = ({ sweepstakeId, sweepstake, onSuccess, onClose, open }: JoinSweepstakeModalProps) => {
  const { register, handleSubmit, reset } = useForm<JoinFormData>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [quotaCount, setQuotaCount] = useState<number>(1)
  const [indicateNumber, setIndicateNumber] = useState<boolean>(false)
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])

  const lotteryType = sweepstake?.lotteryType || 'megasena'
  const rule = useMemo(() => getLotteryRule(lotteryType), [lotteryType])
  const lotteryMeta = useMemo(() => getLotteryMeta(lotteryType), [lotteryType])
  const lotteryColor = lotteryMeta?.color || '#209869'
  const availableNumbers = useMemo(
    () => Array.from({ length: rule.totalNumbers }, (_, i) => i + 1),
    [rule.totalNumbers]
  )

  const remainingQuotas = (sweepstake?.availableQuotas ?? 1) - (sweepstake?.metadata?.filledQuotas ?? 0)
  const maxQuotas = Math.max(1, remainingQuotas)
  const quotaPrice = sweepstake?.quotaPrice ?? 0
  const totalPrice = quotaCount * quotaPrice

  const handleClose = () => {
    setSelectedFile(null)
    setQuotaCount(1)
    setIndicateNumber(false)
    setSelectedNumbers([])
    reset()
    onClose()
  }

  const handleIncrement = () => {
    if (quotaCount < maxQuotas) setQuotaCount((prev) => prev + 1)
  }

  const handleDecrement = () => {
    if (quotaCount > 1) {
      setQuotaCount((prev) => {
        const next = prev - 1
        setSelectedNumbers((current) => current.slice(0, next))
        return next
      })
    }
  }

  const handleToggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers((prev) => prev.filter((n) => n !== num))
    } else {
      if (quotaCount === 1) {
        setSelectedNumbers([num])
      } else if (selectedNumbers.length < quotaCount) {
        setSelectedNumbers((prev) => [...prev, num].sort((a, b) => a - b))
      } else {
        setSelectedNumbers((prev) => [...prev.slice(1), num].sort((a, b) => a - b))
      }
    }
  }

  const onSubmit = async (data: JoinFormData) => {
    if (!data.receipt || data.receipt.length === 0) return
    await useAction({
      action: async () =>
        await joinSweepstake(sweepstakeId, {
          receipt: data.receipt[0],
          quotaCount,
          suggestedNumbers: indicateNumber && selectedNumbers.length > 0 ? selectedNumbers : undefined
        }),
      callback: () => {
        setSelectedFile(null)
        setQuotaCount(1)
        setIndicateNumber(false)
        setSelectedNumbers([])
        onSuccess()
        onClose()
        reset()
      },
      toastMessages: {
        success: 'Participação registrada!',
        pending: 'Enviando comprovante...',
        error: 'Erro ao participar'
      }
    })
  }

  const { onChange, ...restRegister } = register('receipt', { required: true })

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth={indicateNumber ? 'sm' : 'xs'}
      title="Participar do Bolão"
      subtitle="Defina suas cotas e anexe o comprovante PIX"
      formProps={{
        id: 'join-form',
        onSubmit: handleSubmit(onSubmit)
      }}
      actions={
        <>
          <Button onClick={handleClose} color="inherit" size="medium">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!selectedFile}
            size="medium"
          >
            Confirmar
          </Button>
        </>
      }
    >
      <FormContainer>
        <QuantityContainer>
          <Typography variant="subtitle2" fontWeight={600}>
            Quantidade de Cotas
          </Typography>
          <QuantityControl>
            <IconButton size="small" onClick={handleDecrement} disabled={quotaCount <= 1}>
              <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField
              value={quotaCount}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                if (isNaN(val)) return
                if (val >= 1 && val <= maxQuotas) {
                  setQuotaCount(val)
                  setSelectedNumbers((current) => current.slice(0, val))
                }
              }}
              slotProps={{
                htmlInput: {
                  style: { textAlign: 'center', padding: '4px 8px', width: '40px' }
                }
              }}
              size="small"
              variant="outlined"
            />
            <IconButton size="small" onClick={handleIncrement} disabled={quotaCount >= maxQuotas}>
              <AddIcon fontSize="small" />
            </IconButton>
          </QuantityControl>
        </QuantityContainer>

        <TotalSummaryBox>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Valor Total ({quotaCount} {quotaCount === 1 ? 'cota' : 'cotas'}):
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} color="primary">
            {formatCurrency(totalPrice)}
          </Typography>
        </TotalSummaryBox>

        <SuggestionToggleBox>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Indicar um número
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {quotaCount === 1
                  ? 'Escolha 1 dezena para palpitar neste bolão'
                  : `Escolha até ${quotaCount} dezenas (1 por cota)`}
              </Typography>
            </Box>
            <Switch
              size="small"
              checked={indicateNumber}
              onChange={(e) => {
                setIndicateNumber(e.target.checked)
                if (!e.target.checked) setSelectedNumbers([])
              }}
              color="primary"
            />
          </Box>

          {indicateNumber && (
            <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="caption" fontWeight={700} color="primary">
                    {selectedNumbers.length === 0
                      ? 'Nenhum número selecionado'
                      : `Selecionado (${selectedNumbers.length}/${quotaCount}):`}
                  </Typography>
                  {selectedNumbers.map((num) => (
                    <Chip
                      key={num}
                      size="small"
                      label={num < 10 ? `0${num}` : num}
                      onDelete={() => handleToggleNumber(num)}
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: lotteryColor,
                        color: '#ffffff',
                        '& .MuiChip-deleteIcon': { color: '#ffffff' }
                      }}
                    />
                  ))}
                </Box>
                {selectedNumbers.length > 0 && (
                  <Button
                    size="small"
                    variant="text"
                    color="inherit"
                    onClick={() => setSelectedNumbers([])}
                    sx={{ fontSize: '0.7rem', minWidth: 'auto', p: 0, textTransform: 'none' }}
                  >
                    Limpar
                  </Button>
                )}
              </Box>

              <NumberGrid sx={{ maxHeight: 180, p: 1, gap: 0.5 }}>
                {availableNumbers.map((num) => {
                  const isSelected = selectedNumbers.includes(num)
                  return (
                    <NumberBall
                      key={num}
                      selected={isSelected}
                      badgeColor={lotteryColor}
                      onClick={() => handleToggleNumber(num)}
                      sx={{ minWidth: 32, width: 32, height: 32, fontSize: '0.75rem' }}
                    >
                      {num < 10 ? `0${num}` : num}
                    </NumberBall>
                  )
                })}
              </NumberGrid>
            </Box>
          )}
        </SuggestionToggleBox>

        <InstructionBox>
          <Typography variant="subtitle2" fontWeight={700} color="primary">
            Como Participar:
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            1. Realize o PIX no valor de {formatCurrency(totalPrice)}.
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            2. Tire uma foto ou salve o comprovante da transação.
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            3. Toque no botão abaixo para selecionar o comprovante.
          </Typography>
        </InstructionBox>

        <FileUploadBox component="label" htmlFor="receipt-upload">
          <input
            {...restRegister}
            id="receipt-upload"
            type="file"
            accept="image/*,application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              onChange(e)
              setSelectedFile(e.target.files?.[0] ?? null)
            }}
          />
          {selectedFile ? (
            <FileStatusRow>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="body2" fontWeight={700} color="success.main" noWrap>
                {selectedFile.name}
              </Typography>
            </FileStatusRow>
          ) : (
            <FileStatusRow>
              <CloudUploadIcon color="primary" fontSize="small" />
              <Typography variant="body2" fontWeight={700}>
                Selecionar Foto do Comprovante
              </Typography>
            </FileStatusRow>
          )}
        </FileUploadBox>
      </FormContainer>
    </Modal>
  )
}

export default JoinSweepstakeModal
