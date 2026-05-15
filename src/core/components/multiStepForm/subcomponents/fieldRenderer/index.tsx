import { TextField, MenuItem, FormControl, InputLabel, Select, FormHelperText, InputAdornment, IconButton, Typography, Divider, Collapse, Tooltip, Autocomplete } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import * as MuiIcons from '@mui/icons-material'
import { Controller } from 'react-hook-form'
import { forwardRef, useState } from 'react'
import { IMaskInput } from 'react-imask'
import dayjs from 'dayjs'

import { GroupsWrapper, GroupContainer, GroupHeader, GroupHeaderTitle, GroupHeaderLine, GroupCollapseButton, GroupContent, FieldsContainer, FieldWrapper, SubGroupsWrapper, SubGroupContainer, SubGroupHeader, SubGroupHeaderTitle, SubGroupCollapseButton, SubGroupContent, TooltipLine, InfoIcon, PercentAdornment, SubtitleText } from './styles'
import FileUpload from './components/fileUpload'
import FormButton from './components/formButton'
import FormTable from './components/formTable'
import SearchModal from '../searchModal'

import type { ElementType, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import type { FileFieldValue } from './components/fileUpload/types'
import type { FieldRendererProps, MaskedInputProps } from './types'
import type { InputBaseComponentProps } from '@mui/material'
import type { FormField } from '../../types'

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(({ onChange, maskPattern, name, ...other }, ref) => (
  <IMaskInput
    {...other}
    mask={maskPattern}
    inputRef={ref}
    prepareChar={(str) => str.toUpperCase()}
    onAccept={(value: string) => onChange({ target: { name, value } })}
    overwrite
  />
))

const formatCustomValue = (val: string | number, type: string): string => {
  if (!val && val !== 0) return ''
  const digits = String(val).replace(/\D/g, '')
  if (!digits) return ''
  const num = parseInt(digits, 10) / 100
  if (type === 'percentage') return num.toFixed(2).replace('.', ',')
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

const labelWithTooltip = (label?: string, tooltip?: string): ReactNode => {
  if (!tooltip) return label
  const tooltipContent = tooltip.includes('\n')
    ? tooltip.split('\n').map((line, i) => <TooltipLine key={i}>{line || '\u00A0'}</TooltipLine>)
    : tooltip
  return (
    <>
      {label}
      <Tooltip title={tooltipContent} placement="top" arrow>
        <InfoIcon />
      </Tooltip>
    </>
  )
}

const tooltipLabelSx = { overflow: 'visible', whiteSpace: 'nowrap' }

const FieldRenderer = ({ groups, control, context, isStepReadOnly, formStyle = 'simple' }: FieldRendererProps) => {
  const [activeSearch, setActiveSearch] = useState<{ field: FormField; value?: string } | null>(null)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const renderFields = (fields: FormField[], gridColumns?: number) => (
    <FieldsContainer $columns={gridColumns}>
      {fields.map((field) => {
        const SelectedIcon = field.icon ? MuiIcons[field.icon as keyof typeof MuiIcons] : null
        const isRequired = typeof field.required === 'function' ? field.required(context) : !!field.required
        const isReadOnly = isStepReadOnly || (typeof field.readOnly === 'function' ? field.readOnly(context) : !!field.readOnly)
        const isDisabled = typeof field.disabled === 'function' ? field.disabled(context) : !!field.disabled

        const fieldContent = field.type === 'divider' ? (
          <Divider>{field.label && <Typography variant="caption" color="text.secondary">{field.label}</Typography>}</Divider>
        ) : field.type === 'info' ? (
          <Typography variant="body2" color="text.secondary">
            {field.label}
          </Typography>
        ) : field.type === 'button' ? (
          <FormButton field={field} context={context} readOnly={isReadOnly} />
        ) : field.type === 'table' ? (
          <FormTable field={field} context={context} readOnly={isReadOnly} />
        ) : (
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: isRequired ? 'Campo obrigatório' : false,
              pattern: field.validation ? { value: new RegExp(field.validation.pattern), message: field.validation.message } : undefined
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              const handleFieldChange = (newValue: unknown) => {
                const isCustomFormat = field.type === 'currency' || field.type === 'percentage'
                const finalValue = isCustomFormat && (typeof newValue === 'string' || typeof newValue === 'number')
                  ? formatCustomValue(newValue, field.type || '')
                  : newValue

                onChange(finalValue)
                if (field.onChange) field.onChange(finalValue, context)
              }

              if (field.type === 'select') {
                const selectValue = field.multiple
                  ? (Array.isArray(value) ? value : [])
                  : (value || '')
                const resolvedOptions = typeof field.options === 'function' ? field.options(context) : field.options

                return (
                  <FormControl fullWidth required={isRequired} error={!!error} disabled={isDisabled || isReadOnly}>
                    <InputLabel
                      shrink={!!field.tooltip || undefined}
                      sx={field.tooltip ? tooltipLabelSx : undefined}
                    >
                      {labelWithTooltip(field.label, field.tooltip)}
                    </InputLabel>
                    <Select
                      multiple={field.multiple}
                      value={selectValue}
                      label={labelWithTooltip(field.label, field.tooltip) as string}
                      notched={!!field.tooltip || undefined}
                      onChange={(e) => handleFieldChange(e.target.value)}
                      renderValue={
                        field.multiple
                          ? (selected) =>
                            Array.isArray(selected)
                              ? resolvedOptions
                                ?.filter((option) => selected.includes(option.value))
                                .map((option) => option.label)
                                .join(', ') || ''
                              : ''
                          : undefined
                      }
                    >
                      {resolvedOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )
              }

              if (field.type === 'autocomplete') {
                const resolvedOptions = typeof field.options === 'function' ? field.options(context) : (field.options ?? [])
                const stringValue = value ? String(value) : ''
                return (
                  <Autocomplete
                    freeSolo={field.freeSolo}
                    options={resolvedOptions}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                    value={stringValue}
                    inputValue={stringValue}
                    onInputChange={(_, newInputValue, reason) => {
                      if (reason === 'input' || reason === 'clear') handleFieldChange(newInputValue)
                    }}
                    onChange={(_, newValue) => {
                      if (typeof newValue === 'string') handleFieldChange(newValue)
                      else if (newValue) handleFieldChange(newValue.value)
                      else handleFieldChange('')
                    }}
                    disabled={isDisabled || isReadOnly}
                    readOnly={isReadOnly}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={labelWithTooltip(field.label, field.tooltip)}
                        required={isRequired}
                        error={!!error}
                        helperText={error?.message}
                        fullWidth
                        {...(field.tooltip && { InputLabelProps: { shrink: true, sx: tooltipLabelSx } })}
                      />
                    )}
                  />
                )
              }

              if (field.type === 'file') {
                const fileIndex = fields.filter(f => f.type === 'file').findIndex(f => f.name === field.name) + 1
                return (
                  <FileUpload
                    value={(value as FileFieldValue) ?? null}
                    onChange={(val) => { onChange(val); if (field.onChange) field.onChange(val, context) }}
                    label={field.label ?? ''}
                    required={!!field.required}
                    error={error?.message}
                    orderNumber={fileIndex}
                    readOnly={isReadOnly}
                  />
                )
              }

              if (field.type === 'date') {
                return (
                  <DatePicker
                    label={labelWithTooltip(field.label, field.tooltip)}
                    disabled={isDisabled}
                    readOnly={isReadOnly}
                    value={value ? dayjs(value) : null}
                    onChange={(newValue) => handleFieldChange(newValue ? newValue.format('YYYY-MM-DD') : null)}
                    disableFuture={field.disableFuture}
                    disablePast={field.disablePast}
                    minDate={field.minDate ? dayjs(field.minDate) : undefined}
                    maxDate={field.maxDate ? dayjs(field.maxDate) : undefined}
                    slotProps={{
                      field: {
                        clearable: !!value && !isDisabled && !isReadOnly,
                        onClear: () => handleFieldChange(null)
                      },
                      textField: {
                        fullWidth: true,
                        required: isRequired,
                        error: !!error,
                        helperText: error?.message,
                        ...(field.tooltip && {
                          InputLabelProps: { shrink: true, sx: tooltipLabelSx }
                        })
                      }
                    }}
                  />
                )
              }

              const renderEndAdornment = () => {
                if (field.searchConfig) {
                  return (
                    <InputAdornment position="end">
                      <IconButton edge="end" disabled={isDisabled || isReadOnly} onClick={() => !isDisabled && !isReadOnly && setActiveSearch({ field, value: value ? String(value) : undefined })}>
                        {SelectedIcon ? <SelectedIcon /> : <MuiIcons.Search />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
                if (SelectedIcon || field.type === 'percentage') {
                  return (
                    <InputAdornment position="end">
                      {field.type === 'percentage' && <PercentAdornment $hasIcon={!!SelectedIcon}>%</PercentAdornment>}
                      {SelectedIcon && <SelectedIcon color="action" />}
                    </InputAdornment>
                  )
                }
                return undefined
              }

              const isCustomTextType = field.type === 'currency' || field.type === 'percentage'
              const searchHint = field.searchConfig && !isReadOnly && !isDisabled ? 'Pressione Enter para pesquisar' : undefined
              const helperTextContent = error?.message ? (searchHint ? `${error.message} - ${searchHint}` : error.message) : searchHint

              return (
                <TextField
                  type={isCustomTextType ? 'text' : field.type}
                  label={labelWithTooltip(field.label, field.tooltip)}
                  required={isRequired}
                  disabled={isDisabled}
                  value={value || ''}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  error={!!error}
                  helperText={helperTextContent}
                  fullWidth
                  onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (field.searchConfig && !isDisabled && !isReadOnly) {
                        const currentValue = (e.target as HTMLInputElement).value
                        setActiveSearch({ field, value: currentValue || undefined })
                      }
                    }
                  }}
                  onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
                    if ((isReadOnly || isDisabled) && !value) e.preventDefault()
                  }}
                  InputProps={{
                    ...(isReadOnly && { readOnly: true }),
                    ...(field.mask && { inputComponent: MaskedInput as ElementType<InputBaseComponentProps> }),
                    endAdornment: renderEndAdornment()
                  }}
                  inputProps={field.mask ? { maskPattern: field.mask } : undefined}
                  {...(field.tooltip && {
                    InputLabelProps: { shrink: true, sx: tooltipLabelSx }
                  })}
                />
              )
            }}
          />
        )

        return (
          <FieldWrapper key={field.name} $colSpan={field.colSpan} $newRow={field.newRow}>
            {fieldContent}
          </FieldWrapper>
        )
      })}
    </FieldsContainer>
  )

  if (!groups?.length) return null

  return (
    <>
      <GroupsWrapper>
        {groups.map((group, groupIndex) => {
          if (formStyle === 'simple') {
            return (
              <GroupContainer key={`group-${groupIndex}`} $highlight={group.highlight}>
                {group.title && <SubtitleText variant="subtitle1" $highlight={group.highlight}>{group.title}</SubtitleText>}
                {renderFields(group.fields, group.gridColumns)}
              </GroupContainer>
            )
          }

          const isCard = !!group.title
          const collapseKey = group.title || group.fields[0]?.name || String(groupIndex)
          const isCollapsed = !!collapsedGroups[collapseKey]

          return (
            <GroupContainer key={collapseKey} $highlight={group.highlight} $isCard={isCard}>
              {group.title ? (
                <GroupHeader onClick={() => group.collapsible !== false && toggleGroup(collapseKey)}>
                  <GroupHeaderTitle>{group.title}</GroupHeaderTitle>
                  <GroupHeaderLine />
                  <GroupCollapseButton
                    size="small"
                    $collapsed={isCollapsed}
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleGroup(collapseKey) }}
                  >
                    <MuiIcons.ExpandMore />
                  </GroupCollapseButton>
                </GroupHeader>
              ) : null}
              <Collapse in={!isCollapsed} timeout="auto">
                {group.subGroups?.length ? (
                  <SubGroupsWrapper>
                    {group.subGroups.map((subGroup, subIndex) => {
                      const subCollapseKey = `${collapseKey}.${subGroup.title || subGroup.fields[0]?.name || String(subIndex)}`
                      const isSubCollapsed = !!collapsedGroups[subCollapseKey]

                      return (
                        <SubGroupContainer key={subCollapseKey} $seamless={!!subGroup.seamless}>
                          {subGroup.title ? (
                            <SubGroupHeader onClick={() => subGroup.collapsible !== false && toggleGroup(subCollapseKey)}>
                              <SubGroupHeaderTitle>{subGroup.title}</SubGroupHeaderTitle>
                              <SubGroupCollapseButton
                                size="small"
                                $collapsed={isSubCollapsed}
                                onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleGroup(subCollapseKey) }}
                              >
                                <MuiIcons.ExpandMore />
                              </SubGroupCollapseButton>
                            </SubGroupHeader>
                          ) : null}
                          <Collapse in={!isSubCollapsed} timeout="auto">
                            <SubGroupContent $seamless={!!subGroup.seamless}>
                              {renderFields(subGroup.fields, subGroup.gridColumns)}
                            </SubGroupContent>
                          </Collapse>
                        </SubGroupContainer>
                      )
                    })}
                  </SubGroupsWrapper>
                ) : (
                  <GroupContent $isCard={isCard}>
                    {renderFields(group.fields, group.gridColumns)}
                  </GroupContent>
                )}
              </Collapse>
            </GroupContainer>
          )
        })}
      </GroupsWrapper>

      {activeSearch?.field.searchConfig && (
        <SearchModal
          config={activeSearch.field.searchConfig}
          initialValue={activeSearch.value}
          context={context}
          onClose={() => setActiveSearch(null)}
        />
      )}
    </>
  )
}

export default FieldRenderer