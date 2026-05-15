import { TableContainer, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ICON_MARGIN = 8;

export const TableContainerWrapper = styled(TableContainer)(({ theme }) => ({
  width: '100%',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden'
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.action.hover
}));

export const MenuIconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginRight: ICON_MARGIN
});