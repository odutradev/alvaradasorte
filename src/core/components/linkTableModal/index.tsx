import { Dialog, DialogContent, DialogActions, Checkbox, Button } from '@mui/material'
import { useEffect, useState } from 'react'

import Table from '@core/components/table'

import type { TableColumn } from '@core/components/table/types'
import type { LinkTableModalProps, BaseItem } from './types'

const LinkTableModal = <T extends BaseItem>({ filtersConfig, excludeIds, onConfirm, columns, onClose, action, title, open}: LinkTableModalProps<T>) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!open) {
      setSelectedIds([])
      setIsSubmitting(false)
      setRefreshKey((prev) => prev + 1)
    }
  }, [open])

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleConfirm = async () => {
    if (!selectedIds.length) return
    setIsSubmitting(true)
    await onConfirm(selectedIds)
    setIsSubmitting(false)
  }

  const tableColumns: TableColumn<T>[] = [
    {
      key: 'id' as keyof T,
      header: '',
      render: (row) => (
        <Checkbox
          disabled={excludeIds.includes(row.id)}
          checked={selectedIds.includes(row.id)}
          onChange={() => handleToggle(row.id)}
        />
      )
    },
    ...columns
  ]

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth="lg">
      <DialogContent sx={{ p: 3 }}>
        <Table
          paginationProps={{ action }}
          filtersConfig={filtersConfig}
          columns={tableColumns}
          headerTitle={title}
          key={refreshKey}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!selectedIds.length || isSubmitting}>
          Vincular ({selectedIds.length})
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LinkTableModal