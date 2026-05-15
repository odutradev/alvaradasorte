import { Dialog, DialogTitle, DialogActions, Button, TextField, MenuItem, FormControl, InputLabel, Select, Typography, InputAdornment, Divider, Box, Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useCallback, forwardRef } from 'react';
import { IMaskInput } from 'react-imask';
import dayjs from 'dayjs';

import { ModalContainer, ContentContainer, FieldsGrid } from './styles';

import type { InputBaseComponentProps } from '@mui/material';
import type { FormModalProps } from './types';
import type { ElementType } from 'react';

interface MaskedInputProps extends Omit<InputBaseComponentProps, 'onChange'> {
  onChange: (event: { target: { name: string; value: string } }) => void;
  maskPattern: string | RegExp;
  name: string;
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(({ onChange, maskPattern, name, ...other }, ref) => (
  <IMaskInput
    {...other}
    mask={maskPattern}
    inputRef={ref}
    prepareChar={(str) => str.toUpperCase()}
    onAccept={(value: string) => onChange({ target: { name, value } })}
    overwrite
  />
));

const formatCustomValue = (val: string | number, type: string): string => {
  if (!val && val !== 0) return '';
  const digits = String(val).replace(/\D/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10) / 100;
  if (type === 'percentage') return num.toFixed(2).replace('.', ',');
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

const getByPath = (source: Record<string, unknown>, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[key];
  }, source);

const setByPath = (source: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> => {
  if (!path.includes('.')) return { ...source, [path]: value };
  const [head, ...rest] = path.split('.');
  const existing = source[head];
  const inner = existing && typeof existing === 'object' && !Array.isArray(existing)
    ? existing as Record<string, unknown>
    : {};
  return { ...source, [head]: setByPath(inner, rest.join('.'), value) };
};

const setManyByPath = (source: Record<string, unknown>, updates: Record<string, unknown>): Record<string, unknown> =>
  Object.entries(updates).reduce<Record<string, unknown>>((acc, [key, value]) => setByPath(acc, key, value), source);

const FormModal = ({ config, context, onClose, initialValues }: FormModalProps) => {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues ?? {});

  const modalContext = {
    ...context,
    data: values,
    getValues: (() => values) as unknown as typeof context.getValues,
    setValue: ((name: string, value: unknown) => {
      setValues((prev) => setByPath(prev, name, value));
    }) as unknown as typeof context.setValue,
    setMultipleValues: (newValues: Record<string, unknown>) => {
      setValues((prev) => setManyByPath(prev, newValues));
    }
  };

  const handleChange = useCallback((name: string, value: unknown, type?: string, field?: { onChange?: (value: unknown, ctx: typeof modalContext) => void }) => {
    const isCustomFormat = type === 'currency' || type === 'percentage';
    const finalValue = isCustomFormat && (typeof value === 'string' || typeof value === 'number')
      ? formatCustomValue(value, type)
      : value;
    setValues((prev) => {
      let updated = setByPath(prev, name, finalValue);
      if (field?.onChange) {
        const pending: Record<string, unknown> = {};
        const ctx = {
          ...context,
          data: updated,
          getParentValues: context.getValues,
          getValues: (() => updated) as unknown as typeof context.getValues,
          setValue: ((n: string, v: unknown) => { pending[n] = v; }) as unknown as typeof context.setValue,
          setMultipleValues: (vals: Record<string, unknown>) => { Object.assign(pending, vals); }
        };
        field.onChange(finalValue, ctx);
        updated = setManyByPath(updated, pending);
      }
      return updated;
    });
  }, [context]);

  const handleSave = useCallback(() => {
    config.onConfirm(values, context);
    onClose();
  }, [config, context, values, onClose]);

  return (
    <Dialog open maxWidth="md" fullWidth onClose={onClose}>
      <ModalContainer>
        <DialogTitle>{config.title}</DialogTitle>
        <ContentContainer dividers>
          <FieldsGrid $columns={config.gridColumns}>
            {config.fields.map((field) => {
              if (field.conditionalRender && !field.conditionalRender(modalContext)) return null;

              const fieldValue = getByPath(values, field.name);
              const isRequired = typeof field.required === 'function' ? field.required(modalContext) : field.required;
              const isReadOnly = typeof field.readOnly === 'function' ? field.readOnly(modalContext) : field.readOnly;
              const isDisabled = typeof field.disabled === 'function' ? field.disabled(modalContext) : field.disabled;

              if (field.type === 'divider') {
                return (
                  <Box key={field.name} sx={{ gridColumn: '1 / -1' }}>
                    <Divider>{field.label && <Typography variant="caption" color="text.secondary">{field.label}</Typography>}</Divider>
                  </Box>
                );
              }

              if (field.type === 'button') {
                return (
                  <Box key={field.name} sx={{ gridColumn: field.colSpan ? `span ${field.colSpan}` : undefined }}>
                    <Button variant={field.buttonVariant || 'outlined'} onClick={() => field.onButtonClick?.(modalContext)} fullWidth>
                      {field.label}
                    </Button>
                  </Box>
                );
              }

              if (field.type === 'select') {
                const resolvedOptions = typeof field.options === 'function' ? field.options(context) : field.options;

                if (field.freeSolo) {
                  return (
                    <Autocomplete
                      key={field.name}
                      freeSolo
                      options={resolvedOptions || []}
                      getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                      value={null}
                      inputValue={(fieldValue as string) || ''}
                      filterOptions={(opts, state) => {
                        const input = state.inputValue.toLowerCase();
                        if (!input) return opts;
                        return opts.filter((o) => o.label.toLowerCase().includes(input));
                      }}
                      onInputChange={(_, newInputValue, reason) => {
                        if (reason === 'input' || reason === 'clear') {
                          handleChange(field.name, reason === 'clear' ? '' : newInputValue, undefined, field);
                        }
                      }}
                      onChange={(_, newValue) => {
                        if (newValue && typeof newValue !== 'string') {
                          handleChange(field.name, newValue.value, undefined, field);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label={field.label} required={isRequired} fullWidth />
                      )}
                    />
                  );
                }

                return (
                  <FormControl key={field.name} fullWidth required={isRequired} disabled={isDisabled || isReadOnly}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      value={(fieldValue as string) || ''}
                      label={field.label}
                      onChange={(e) => handleChange(field.name, e.target.value, undefined, field)}
                    >
                      {resolvedOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              if (field.type === 'autocomplete') {
                const resolvedOptions = typeof field.options === 'function' ? field.options(context) : (field.options ?? []);

                if (field.multiple) {
                  const rawValue = fieldValue as unknown[];
                  const currentValues = Array.isArray(rawValue) ? rawValue.map(String) : [];
                  const selectedOptions = resolvedOptions.filter((opt) => currentValues.includes(String(opt.value)));
                  return (
                    <Box key={field.name} sx={{ gridColumn: field.colSpan ? `span ${field.colSpan}` : undefined }}>
                      <Autocomplete
                        multiple
                        disabled={isDisabled}
                        readOnly={isReadOnly}
                        options={resolvedOptions}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                        value={selectedOptions}
                        onChange={(_, newValue) => {
                          handleChange(field.name, (newValue as Array<{ value: string }>).map((opt) => opt.value));
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label={field.label} required={isRequired} fullWidth />
                        )}
                      />
                    </Box>
                  );
                }

                if (field.freeSolo) {
                  const stringValue = String(fieldValue ?? '');
                  return (
                    <Box key={field.name} sx={{ gridColumn: field.colSpan ? `span ${field.colSpan}` : undefined }}>
                      <Autocomplete
                        freeSolo
                        disabled={isDisabled}
                        readOnly={isReadOnly}
                        options={resolvedOptions}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                        value={stringValue}
                        inputValue={stringValue}
                        filterOptions={(opts, state) => {
                          const input = state.inputValue.toLowerCase();
                          if (!input) return opts;
                          return opts.filter((o) => o.label.toLowerCase().includes(input));
                        }}
                        onInputChange={(_, newInputValue, reason) => {
                          if (reason === 'input' || reason === 'clear') {
                            handleChange(field.name, reason === 'clear' ? '' : newInputValue, undefined, field);
                          }
                        }}
                        onChange={(_, newValue) => {
                          if (newValue && typeof newValue !== 'string') {
                            handleChange(field.name, (newValue as { value: string }).value, undefined, field);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label={field.label} required={isRequired} fullWidth />
                        )}
                      />
                    </Box>
                  );
                }

                const selectedOption = resolvedOptions.find((opt) => String(opt.value) === String(fieldValue ?? '')) ?? null;
                return (
                  <Box key={field.name} sx={{ gridColumn: field.colSpan ? `span ${field.colSpan}` : undefined }}>
                    <Autocomplete
                      disabled={isDisabled}
                      readOnly={isReadOnly}
                      options={resolvedOptions}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                      value={selectedOption}
                      onChange={(_, newValue) => {
                        if (newValue) handleChange(field.name, (newValue as { value: string }).value, undefined, field);
                        else handleChange(field.name, '', undefined, field);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label={field.label} required={isRequired} fullWidth />
                      )}
                    />
                  </Box>
                );
              }

              if (field.type === 'date') {
                return (
                  <DatePicker
                    key={field.name}
                    label={field.label}
                    value={fieldValue ? dayjs(fieldValue as string) : null}
                    onChange={(newValue) => handleChange(field.name, newValue ? newValue.format('YYYY-MM-DD') : null, undefined, field)}
                    disabled={isDisabled}
                    readOnly={isReadOnly}
                    disableFuture={field.disableFuture}
                    disablePast={field.disablePast}
                    slotProps={{
                      field: {
                        clearable: !!fieldValue && !isReadOnly && !isDisabled,
                        onClear: () => handleChange(field.name, null, undefined, field)
                      },
                      textField: {
                        fullWidth: true,
                        required: isRequired
                      }
                    }}
                  />
                );
              }

              const isCustomFormat = field.type === 'currency' || field.type === 'percentage';

              return (
                <TextField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={isCustomFormat ? 'text' : field.type}
                  required={isRequired}
                  disabled={isDisabled}
                  value={(fieldValue as string) || ''}
                  onChange={(e) => handleChange(field.name, e.target.value, field.type, field)}
                  fullWidth
                  InputProps={{
                    ...(isReadOnly && { readOnly: true }),
                    ...(field.mask && { inputComponent: MaskedInput as ElementType<InputBaseComponentProps> }),
                    ...(field.type === 'percentage' && {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography color="text.secondary">%</Typography>
                        </InputAdornment>
                      )
                    })
                  }}
                  inputProps={field.mask ? { maskPattern: field.mask } : undefined}
                />
              );
            })}
          </FieldsGrid>
        </ContentContainer>
        <DialogActions>
          <Button onClick={() => { config.onCancel?.(context); onClose(); }} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </ModalContainer>
    </Dialog>
  );
};

export default FormModal;
