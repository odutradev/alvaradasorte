import { Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Typography, Button } from '@mui/material';

import { TableContainerWrapper, StyledTableRow, CenterContent, EmptyIcon } from './styles';

import type { TableViewProps } from './types';

const TableView = ({ results, columns, isLoading, onSelect }: TableViewProps) => (
  <TableContainerWrapper>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col.key}>{col.header}</TableCell>
          ))}
          <TableCell align="right">Ação</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          <StyledTableRow>
            <TableCell colSpan={columns.length + 1}>
              <CenterContent>
                <CircularProgress size={40} />
                <Typography variant="body1">Buscando resultados...</Typography>
              </CenterContent>
            </TableCell>
          </StyledTableRow>
        ) : results.length > 0 ? (
          results.map((row, index) => (
            <StyledTableRow key={index} hover>
              {columns.map((col) => (
                <TableCell key={col.key}>{String(row[col.key] ?? '-')}</TableCell>
              ))}
              <TableCell align="right">
                <Button size="small" variant="outlined" onClick={() => onSelect(row)}>
                  Selecionar
                </Button>
              </TableCell>
            </StyledTableRow>
          ))
        ) : (
          <StyledTableRow>
            <TableCell colSpan={columns.length + 1}>
              <CenterContent>
                <EmptyIcon />
                <Typography variant="body1">Nenhum resultado encontrado.</Typography>
              </CenterContent>
            </TableCell>
          </StyledTableRow>
        )}
      </TableBody>
    </Table>
  </TableContainerWrapper>
);

export default TableView;