import { IconButton, CircularProgress } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

import { TableHeaderContainer, TitleContainer, HeaderTitle, TotalBadgeContainer, HeaderActionsContainer, HeaderContentWrapper, ButtonsWrapper, StyledHeaderButton } from './styles'
import TableFilters from '../filters'

import type { TableHeaderProps } from './types'

const TableHeader = ({ onFilterChange, activeFilters, filtersConfig, headerButtons, headerContent, displayLoading, headerTitle = 'Registros', onReload, totalItems }: TableHeaderProps) => (
  <TableHeaderContainer>
    <TitleContainer>
      <HeaderTitle>{headerTitle}</HeaderTitle>
      {totalItems > 0 && (
        <TotalBadgeContainer>
          {totalItems}
        </TotalBadgeContainer>
      )}
    </TitleContainer>
    <HeaderActionsContainer>
      {headerContent && (
        <HeaderContentWrapper>
          {headerContent}
        </HeaderContentWrapper>
      )}
      {headerButtons && headerButtons.length > 0 && (
        <ButtonsWrapper>
          {headerButtons.map((btn, idx) => (
            <StyledHeaderButton
              variant={btn.variant || 'outlined'}
              color={btn.color || 'primary'}
              disabled={btn.disabled}
              onClick={btn.onClick}
              startIcon={btn.icon}
              disableElevation
              size="small"
              key={idx}
            >
              {btn.label}
            </StyledHeaderButton>
          ))}
        </ButtonsWrapper>
      )}
      {onReload && (
        <IconButton onClick={onReload} disabled={displayLoading} size="small">
          {displayLoading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
        </IconButton>
      )}
      <TableFilters
        activeFilters={activeFilters}
        onApply={onFilterChange || (() => {})}
        config={filtersConfig}
      />
    </HeaderActionsContainer>
  </TableHeaderContainer>
)

export default TableHeader