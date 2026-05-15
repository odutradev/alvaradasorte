import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import * as MuiIcons from '@mui/icons-material'
import { Fragment, useState } from 'react'

import { TableContainerWrapper, MenuIconWrapper, HeaderContainer } from './styles'

import type { FormTableProps } from './types'
import type { MouseEvent } from 'react'

const FormTable = ({ field, context, readOnly }: FormTableProps) => {
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>, row: Record<string, unknown>) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const handleExecuteAction = (action: (row: Record<string, unknown>, ctx: typeof context) => void) => {
    if (selectedRow) action(selectedRow, context)
    handleCloseMenu()
  }

  const toggleExpand = (rowKey: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowKey)) next.delete(rowKey)
      else next.add(rowKey)
      return next
    })
  }

  const rawData = (context.data[field.name] as Record<string, unknown>[]) || field.tableData
  const tableData = field.tableRowFilter ? rawData?.filter(field.tableRowFilter) : rawData

  if (!field.tableColumns || !tableData || !tableData.length) return null

  const expandable = !!field.renderRowDetail
  const totalColumns = field.tableColumns.length + (expandable ? 1 : 0) + (field.tableActions && !readOnly ? 1 : 0)

  return (
    <TableContainerWrapper>
      <HeaderContainer>
        <Typography variant="subtitle2" color="text.secondary">{field.label}</Typography>
      </HeaderContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {expandable && <TableCell padding="checkbox" />}
            {field.tableColumns.map((col) => (
              <TableCell key={col.key}>{col.header}</TableCell>
            ))}
            {field.tableActions && !readOnly && <TableCell align="right">Ações</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, rowIndex) => {
            const rowKey = String(row.id ?? rowIndex)
            const isExpanded = expandedRows.has(rowKey)
            const rowDetail = expandable ? field.renderRowDetail!(row, context) : null
            const rowExpandable = rowDetail != null && rowDetail !== false
            return (
              <Fragment key={rowKey}>
                <TableRow hover>
                  {expandable && (
                    <TableCell padding="checkbox">
                      {rowExpandable && (
                        <IconButton size="small" onClick={() => toggleExpand(rowKey)} aria-label={isExpanded ? 'Recolher' : 'Expandir'}>
                          {isExpanded ? <MuiIcons.KeyboardArrowDown fontSize="small" /> : <MuiIcons.KeyboardArrowRight fontSize="small" />}
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                  {field.tableColumns!.map((col) => (
                    <TableCell key={col.key}>
                      {col.format ? col.format(row, context.data) : String(row[col.key] ?? '-')}
                    </TableCell>
                  ))}
                  {field.tableActions && !readOnly && (
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, row)}>
                        <MuiIcons.MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
                {expandable && isExpanded && rowExpandable && (
                  <TableRow>
                    <TableCell colSpan={totalColumns} sx={{ backgroundColor: 'action.hover', padding: 2 }}>
                      {rowDetail}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>

      {field.tableActions && !readOnly && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          {field.tableActions.map((action, index) => {
            const ActionIcon = action.icon ? MuiIcons[action.icon as keyof typeof MuiIcons] : null
            return (
              <MenuItem key={index} onClick={() => handleExecuteAction(action.onClick)}>
                {ActionIcon && (
                  <MenuIconWrapper>
                    <ActionIcon fontSize="small" />
                  </MenuIconWrapper>
                )}
                {action.label}
              </MenuItem>
            )
          })}
        </Menu>
      )}
    </TableContainerWrapper>
  )
}

export default FormTable