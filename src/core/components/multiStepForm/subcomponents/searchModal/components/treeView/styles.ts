import { Box, Typography } from '@mui/material';
import { SearchOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const IDENTATION_MULTIPLIER = 3;
const MIN_NODE_HEIGHT = 40;
const ICON_OPACITY = 0.5;
const ICON_SIZE = 64;

export const TreeContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  overflowY: 'auto',
  maxHeight: '60vh'
}));

export const NodeContainer = styled(Box)<{ $level: number }>(({ theme, $level }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: MIN_NODE_HEIGHT,
  paddingLeft: theme.spacing($level * IDENTATION_MULTIPLIER),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

export const NodeText = styled(Typography)<{ $clickable: boolean }>(({ $clickable }) => ({
  cursor: $clickable ? 'pointer' : 'default',
  userSelect: 'none',
  marginLeft: 8
}));

export const Spacer = styled(Box)({
  flexShrink: 0,
  width: 28
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

export const EmptyText = styled(Typography)({});