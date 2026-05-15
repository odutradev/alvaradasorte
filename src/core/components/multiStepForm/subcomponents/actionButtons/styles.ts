import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: 'auto',
  gap: theme.spacing(2),
  justifyContent: 'flex-end'
}));

export const ActionButton = styled(Button)({});