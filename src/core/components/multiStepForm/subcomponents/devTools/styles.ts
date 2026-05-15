import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const DevToolsContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.error.light + '1A',
  border: `1px dashed ${theme.palette.error.main}`,
  borderRadius: theme.shape.borderRadius
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1)
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase'
}));

export const StateViewerContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.success.main,
  '& pre': {
    margin: 0,
    fontFamily: 'monospace',
    fontSize: '0.85rem'
  }
}));