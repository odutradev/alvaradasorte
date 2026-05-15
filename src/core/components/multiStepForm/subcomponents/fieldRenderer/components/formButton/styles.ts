import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const BUTTON_HEIGHT = 56;

export const ButtonContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  height: BUTTON_HEIGHT,
  '& button': {
    height: '100%'
  }
});