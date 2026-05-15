import { TableBody as MuiTableBody, TableCell, TableRow, IconButton, Table as MuiTable } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import InboxIcon from '@mui/icons-material/Inbox'

import { StyledTableContainer, StyledTableHead, EmptyTableRow, EmptyStateContainer, EmptyStateText, StyledTableRow } from './styles'

import type { TableBodyProps } from './types'

const TableBody = <T extends { id: string | number }>({ displayLoading, onOpenMenu, columns, actions, data }: TableBodyProps<T>) => (
  <StyledTableContainer $isLoading={displayLoading}>
    <MuiTable>
      <StyledTableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={String(column.key)}>{column.header}</TableCell>
          ))}
          {actions && actions.length > 0 && <TableCell align="right">Ações</TableCell>}
        </TableRow>
      </StyledTableHead>
      <MuiTableBody>
        {data.length === 0 ? (
          <EmptyTableRow>
            <TableCell colSpan={columns.length + (actions?.length ? 1 : 0)} align="center">
              <EmptyStateContainer>
                <InboxIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                <EmptyStateText>{displayLoading ? 'Carregando registros...' : 'Nenhum registro encontrado'}</EmptyStateText>
              </EmptyStateContainer>
            </TableCell>
          </EmptyTableRow>
        ) : (
          data.map((row, index) => (
            <StyledTableRow
              key={row.id}
              $isLast={index === data.length - 1}
              $totalInPage={data.length}
            >
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '-')}
                </TableCell>
              ))}
              {actions && actions.length > 0 && (
                <TableCell align="right">
                  <IconButton onClick={(e) => onOpenMenu(e, row)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              )}
            </StyledTableRow>
          ))
        )}
      </MuiTableBody>
    </MuiTable>
  </StyledTableContainer>
)

export default TableBody