import { TableContainer, TableRow, Box } from '@mui/material';
import { SearchOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ICON_SIZE = 64;
const ICON_OPACITY = 0.5;

export const TableContainerWrapper = styled(TableContainer)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  maxHeight: '60vh'
}));

export const StyledTableRow = styled(TableRow)({
  '&:last-child td, &:last-child th': {
    borderBottom: 0
  }
});

export const CenterContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(8),
  justifyContent: 'center',
  color: theme.palette.text.secondary
}));

export const EmptyIcon = styled(SearchOff)({
  fontSize: ICON_SIZE,
  opacity: ICON_OPACITY
});