import { TableFooterContainer, CustomFooterContainer } from './styles'
import Pagination from '@core/components/pagination'

import type { TableFooterProps } from './types'

const TableFooter = ({ footerPosition = 'left', footerContent, onLimitChange, onPageChange, meta }: TableFooterProps) => {
  const paginationJustify = footerContent
    ? footerPosition === 'left' ? 'flex-end' : 'flex-start'
    : 'space-between'

  return (
    <TableFooterContainer>
      {footerPosition === 'left' && footerContent && (
        <CustomFooterContainer>{footerContent}</CustomFooterContainer>
      )}
      {meta && onLimitChange && onPageChange && (
        <Pagination
          onLimitChange={onLimitChange}
          onPageChange={onPageChange}
          justify={paginationJustify}
          meta={meta}
        />
      )}
      {footerPosition === 'right' && footerContent && (
        <CustomFooterContainer>{footerContent}</CustomFooterContainer>
      )}
    </TableFooterContainer>
  )
}

export default TableFooter