import { RootContainer } from '../../styles'
import TableHeader from '../tableHeader'
import TableFooter from '../tableFooter'
import ActionMenu from '../actionMenu'
import TableBody from '../tableBody'
import useTable from '../../hook'

import type { ManualTableProps } from '../../types'

const BaseTable = <T extends { id: string | number }>({
  footerPosition = 'left',
  headerTitle = 'Registros',
  onFilterChange,
  filtersConfig,
  headerButtons,
  activeFilters,
  disableHeader,
  headerContent,
  footerContent,
  onLimitChange,
  onPageChange,
  totalItems,
  isLoading,
  onReload,
  columns,
  actions,
  data,
  meta
}: ManualTableProps<T>) => {
  const {
    handleActionClick,
    handleCloseMenu,
    handleOpenMenu,
    displayLoading,
    selectedRow,
    anchorEl
  } = useTable<T>({ isLoading })

  const displayTotal = totalItems ?? meta?.total ?? 0

  return (
    <RootContainer>
      {!disableHeader && (
        <TableHeader
          onFilterChange={onFilterChange}
          activeFilters={activeFilters}
          filtersConfig={filtersConfig}
          headerButtons={headerButtons}
          displayLoading={displayLoading}
          headerContent={headerContent}
          headerTitle={headerTitle}
          totalItems={displayTotal}
          onReload={onReload}
        />
      )}
      <TableBody
        displayLoading={displayLoading}
        onOpenMenu={handleOpenMenu}
        columns={columns}
        actions={actions}
        data={data}
      />
      <TableFooter
        onLimitChange={onLimitChange}
        onPageChange={onPageChange}
        footerPosition={footerPosition}
        footerContent={footerContent}
        meta={meta}
      />
      <ActionMenu
        onActionClick={handleActionClick}
        selectedRow={selectedRow}
        onClose={handleCloseMenu}
        anchorEl={anchorEl}
        actions={actions}
      />
    </RootContainer>
  )
}

export default BaseTable