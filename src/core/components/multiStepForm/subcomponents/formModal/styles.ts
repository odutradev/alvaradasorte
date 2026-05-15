import { Box, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ModalContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
});

export const ContentContainer = styled(DialogContent)({
  display: 'flex',
  flexDirection: 'column'
});

export const FieldsGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$columns'
})<{ $columns?: number }>(({ theme, $columns = 2 }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${$columns}, 1fr)`,
  gap: theme.spacing(2)
}));
