import type { ReactNode } from 'react'

export interface InfoRowProps {
  label: string
  value: string | ReactNode
  valueColor?: string
}