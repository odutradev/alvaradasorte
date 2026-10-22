export interface ValueSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  format?: 'number' | 'currency'
  markStep?: number
}