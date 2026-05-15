import { Pagination as MuiPagination, Typography, MenuItem } from '@mui/material'

import { PaginationContainer, LimitContainer, StyledSelect } from './styles'

import type { SelectChangeEvent } from '@mui/material'
import type { PaginationProps } from './types'

const Pagination = ({ justify = 'space-between', onLimitChange, onPageChange, meta }: PaginationProps) => {
  const handleLimit = (event: SelectChangeEvent<number>) => onLimitChange(Number(event.target.value))

  const handlePage = (_: unknown, newPage: number) => onPageChange(newPage)

  const limitOptions = Array.from(new Set([15, 30, 50, 100, ...(meta?.limit ? [meta.limit] : [])])).sort((a, b) => a - b)

  return (
    <PaginationContainer $justify={justify}>
      <LimitContainer>
        <Typography variant="body2" color="text.secondary">
          Itens por página
        </Typography>
        <StyledSelect onChange={handleLimit} value={meta.limit} size="small">
          {limitOptions.map((option) => (
            <MenuItem value={option} key={option}>
              {option}
            </MenuItem>
          ))}
        </StyledSelect>
      </LimitContainer>
      <MuiPagination
        count={meta.totalPages}
        onChange={handlePage}
        color="primary"
        shape="rounded"
        page={meta.page}
      />
    </PaginationContainer>
  )
}

export default Pagination