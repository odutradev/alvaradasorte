import { Box, DialogContent, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const BUTTON_MIN_WIDTH = 180;
const BUTTON_HEIGHT = 56;

export const ModalContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
});

export const ContentContainer = styled(DialogContent)({
  display: 'flex',
  flexDirection: 'column'
});

export const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'flex-start',
  marginBottom: theme.spacing(3)
}));

export const SearchButton = styled(Button)({
  height: BUTTON_HEIGHT,
  minWidth: BUTTON_MIN_WIDTH
});