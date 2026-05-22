import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

export const GamesSection = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  marginBottom: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2)
}))

export const ResultSection = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  display: 'flex',
  gap: theme.spacing(2)
}))

export const SectionDivider = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  marginBottom: theme.spacing(3),
  height: '1px',
  width: '100%'
}))

export const GameRow = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 1.5),
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1)
}))

export const NumbersContainer = styled(Box)(({ theme }) => ({
  flexWrap: 'wrap',
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(0.5),
  flex: 1
}))

export const NumberChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'matched'
})<{ matched: boolean }>(({ theme, matched }) => ({
  backgroundColor: matched ? theme.palette.success.main : theme.palette.action.selected,
  color: matched ? theme.palette.success.contrastText : theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.25, 0.75),
  fontWeight: matched ? 700 : 400,
  fontSize: '0.8125rem',
  textAlign: 'center',
  minWidth: 28
}))

export const InputRow = styled(Box)(({ theme }) => ({
  alignItems: 'flex-start',
  display: 'flex',
  gap: theme.spacing(1)
}))

export const SaveButton = styled(Button)({
  alignSelf: 'flex-start'
})
