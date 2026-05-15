import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { Check } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

export const FileUploadWrapper = styled(Box)({ width: '100%' })

export const HiddenFileInput = styled('input')({ display: 'none' })

export const FileRow = styled(Box)<{ $hasError?: boolean; $hasFile?: boolean }>(({ theme, $hasError, $hasFile }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(2),
  border: `1px solid ${$hasError ? theme.palette.error.main : $hasFile ? theme.palette.success.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5, 2),
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  transition: 'border-color 0.2s',
}))

export const FileRowContent = styled(Box)({ flex: 1 })

export const FileRowMainLine = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  minHeight: 40,
}))

export const OrderBadge = styled(Box)<{ $hasFile?: boolean }>(({ theme, $hasFile }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: $hasFile ? theme.palette.success.main : theme.palette.primary.main,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.7rem',
  fontWeight: 700,
  flexShrink: 0,
  transition: 'background-color 0.2s',
}))

export const LabelText = styled(Typography)({ flex: 1, fontSize: '0.875rem', lineHeight: 1.4 })

export const FileNameText = styled(Typography)({
  maxWidth: 200,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const ObrigatoryChip = styled(Chip)({ flexShrink: 0 })

export const UploadButton = styled(Button)({ flexShrink: 0 })

export const FileInfoStack = styled(Stack)({ flexShrink: 0 })

export const DescriptionWrapper = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
}))

export const SaveDescriptionButton = styled(Button)({
  flexShrink: 0,
  minWidth: 80,
})

export const CheckIcon = styled(Check)({ fontSize: 14 })

export const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  paddingTop: theme.spacing(0.75),
}))
