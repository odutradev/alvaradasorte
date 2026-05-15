import BaseTable from './subcomponents/baseTable'
import AutoTable from './subcomponents/autoTable'
import useTable from './hook'

import type { TableProps } from './types'

const Table = <T extends { id: string | number }>(props: TableProps<T>) => {
  const { isAutoTable, autoProps, manualProps } = useTable<T>({ props })

  if (isAutoTable) return <AutoTable {...autoProps} />
  return <BaseTable {...manualProps} />
}

export default Table