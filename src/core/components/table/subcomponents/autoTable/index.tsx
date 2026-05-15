import usePagination from '@core/hooks/usePagination'
import BaseTable from '../baseTable'

import type { AutoTableProps } from '../../types'

const AutoTable = <T extends { id: string | number }>({ paginationProps, filtersConfig, disableHeader, headerTitle, totalItems, columns, actions, headerContent, footerContent, footerPosition, headerButtons }: AutoTableProps<T>) => {
  const { handleFilterChange, handleLimitChange, handlePageChange, activeFilters, isLoading, reload, data, meta } = usePagination<T>({ initialLimit: 15, ...paginationProps })

  return (
    <BaseTable
      onFilterChange={handleFilterChange}
      onLimitChange={handleLimitChange}
      onPageChange={handlePageChange}
      footerPosition={footerPosition}
      headerButtons={headerButtons}
      activeFilters={activeFilters}
      filtersConfig={filtersConfig}
      disableHeader={disableHeader}
      headerContent={headerContent}
      footerContent={footerContent}
      headerTitle={headerTitle}
      totalItems={totalItems}
      isLoading={isLoading}
      onReload={reload}
      columns={columns}
      actions={actions}
      data={data}
      meta={meta}
    />
  )
}

export default AutoTable