import CircularProgress from '@mui/material/CircularProgress'
import MuiTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'

import { StyledTableContainer } from './styles'
import type { TableProps } from './types'

const Table = <T,>({
  columns,
  data = [],
  getRowKey = (_, index) => index,
  loading = false,
  loadingComponent,
  emptyState,
  size = 'small',
  stickyHeader = true,
  hover = true,
  pagination,
  ariaLabel,
  onRowClick,
  sx,
  containerSx,
  children
}: TableProps<T>) => {
  if (loading && data.length === 0) {
    if (loadingComponent) {
      return <>{loadingComponent}</>
    }
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: 200 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!loading && data.length === 0 && emptyState && !children) {
    return <>{emptyState}</>
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden', ...containerSx }}>
      <StyledTableContainer sx={sx}>
        <MuiTable size={size} stickyHeader={stickyHeader} aria-label={ariaLabel}>
          {children ? (
            children
          ) : (
            <>
              {columns && columns.length > 0 && (
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                          backgroundColor: 'background.paper',
                          fontWeight: 600,
                          width: column.width,
                          minWidth: column.minWidth,
                          ...column.headerSx
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
              )}
              <TableBody>
                {data.map((item, index) => (
                  <TableRow
                    key={getRowKey(item, index)}
                    hover={hover}
                    onClick={onRowClick ? () => onRowClick(item, index) : undefined}
                    sx={onRowClick ? { cursor: 'pointer' } : undefined}
                  >
                    {columns?.map((column) => (
                      <TableCell key={column.id} align={column.align} sx={column.cellSx}>
                        {column.render ? column.render(item, index) : (item as Record<string, unknown>)[column.id] as React.ReactNode}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </MuiTable>
      </StyledTableContainer>
      {pagination}
    </Box>
  )
}

export default Table
export { StyledTableContainer }
export type { TableProps, TableColumn } from './types'
