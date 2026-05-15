import type { ReactNode } from 'react'

export interface TabItem {
  isVisible?: boolean
  content: ReactNode
  label: string
}

export interface TabsProps {
  defaultTab?: number
  items: TabItem[]
}