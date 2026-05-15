import FilterListIcon from '@mui/icons-material/FilterList'
import { IconButton, Badge, Fade } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState, useMemo } from 'react'

import { StyledDialog, HeaderContainer, FilterTitle, FormWrapper } from './styles'
import MultiStepForm from '@core/components/multiStepForm'

import type { FormConfig, FormAction } from '@core/components/multiStepForm/types'
import type { FiltersProps } from './types'

const TableFilters = ({ activeFilters, onApply, config }: FiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const activeCount = useMemo(() => Object.keys(activeFilters ?? {}).filter((k) => activeFilters?.[k] !== '').length, [activeFilters])

  if (!config || config.length === 0) return null

  const handleOpen = () => setIsOpen(true)

  const handleClose = () => setIsOpen(false)

  const handleSubmit = (data: Record<string, unknown>) => {
    const cleanData = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== '' && v !== undefined && v !== null))
    onApply(cleanData as Record<string, string | number | boolean>)
    handleClose()
  }

  const formConfigWithActions: FormConfig = {
    formStyle: 'simple',
    steps: [
      {
        id: 'table-filters',
        title: 'Filtros',
        groups: config,
        actions: [
          {
            label: 'Limpar Filtros',
            actionType: 'custom',
            variant: 'outlined',
            onClick: async (ctx) => {
              const currentValues = ctx.getValues() as Record<string, unknown>
              const emptyValues = Object.keys(currentValues ?? {}).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
              ctx.setMultipleValues(emptyValues)
              onApply({})
            }
          },
          {
            label: 'Aplicar Resultados',
            actionType: 'submit',
            variant: 'contained'
          }
        ] as FormAction[]
      }
    ]
  }

  return (
    <>
      <IconButton onClick={handleOpen} size="small">
        <Badge badgeContent={activeCount} color="primary">
          <FilterListIcon />
        </Badge>
      </IconButton>
      <StyledDialog
        TransitionComponent={Fade}
        onClose={handleClose}
        maxWidth="md"
        open={isOpen}
        fullWidth
      >
        <HeaderContainer>
          <FilterTitle>Filtros Avançados</FilterTitle>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </HeaderContainer>
        <FormWrapper>
          <MultiStepForm
            key={isOpen ? 'open' : 'closed'}
            config={formConfigWithActions}
            initialData={activeFilters}
            onSubmit={handleSubmit}
          />
        </FormWrapper>
      </StyledDialog>
    </>
  )
}

export default TableFilters