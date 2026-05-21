import { Slider, TextField, InputAdornment, Typography } from '@mui/material'

import { RowContainer, Container } from './styles'

import type { ValueSliderProps } from './types'

const ValueSlider = ({ label, value, onChange, min, max, step = 1, format = 'number' }: ValueSliderProps) => {
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    onChange(newValue as number)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = Number(event.target.value)
    if (!isNaN(numValue)) {
      onChange(Math.max(min, Math.min(max, numValue)))
    }
  }

  return (
    <Container>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
      <RowContainer>
        <Slider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleSliderChange}
          color="primary"
          sx={{ flex: 1 }}
        />
        <TextField
          value={value}
          onChange={handleInputChange}
          type="number"
          size="small"
          InputProps={{
            startAdornment: format === 'currency' ? <InputAdornment position="start">R$</InputAdornment> : null,
            inputProps: { min, max, step }
          }}
          sx={{ width: format === 'currency' ? 140 : 100 }}
        />
      </RowContainer>
    </Container>
  )
}

export default ValueSlider