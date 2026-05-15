import { AutoAwesome, BugReport, DeleteSweep, DataObject, LayersClear, AccountTree } from '@mui/icons-material';
import { Typography, Button, Collapse } from '@mui/material';
import { useState, useMemo } from 'react';

import { DevToolsContainer, HeaderContainer, ButtonsContainer, StateViewerContainer, SectionTitle } from './styles';

import type { FormStep, FormGroup, FormField } from '../../types';
import type { DevToolsProps } from './types';

const getAllFieldsDeep = (group: FormGroup): FormField[] => [
  ...(group.fields ?? []),
  ...(group.subGroups ?? []).flatMap(getAllFieldsDeep)
];

const getAllFieldsWithModals = (group: FormGroup): FormField[] => {
  const base = getAllFieldsDeep(group);
  const modal = base.flatMap((f) => f.formModalConfig?.fields ?? []);
  return [...base, ...modal];
};

const setNested = (target: Record<string, unknown>, path: string, value: unknown): void => {
  const parts = path.split('.');
  let curr = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    if (typeof curr[key] !== 'object' || curr[key] === null || Array.isArray(curr[key])) {
      curr[key] = {};
    }
    curr = curr[key] as Record<string, unknown>;
  }
  curr[parts[parts.length - 1]] = value;
};

const emptyValueFor = (field: FormField): unknown => (field.type === 'table' ? [] : '');

const DevTools = ({ isOpen, config, context }: DevToolsProps) => {
  const [showSchema, setShowSchema] = useState(false);
  const [showState, setShowState] = useState(false);

  const formSchema = useMemo(() => {
    const schema: Record<string, unknown> = {};
    config.steps.forEach((step) => {
      step.groups.flatMap(getAllFieldsWithModals).forEach((field) => {
        const baseField = field.preSet && config.fieldPreSets?.[field.preSet] ? { ...config.fieldPreSets[field.preSet], ...field } : field;
        if (baseField.type === 'info' || baseField.type === 'button' || baseField.type === 'divider') return;
        const value = baseField.type === 'table'
          ? (baseField.tableColumns ? [baseField.tableColumns.reduce((acc, col) => ({ ...acc, [col.key]: 'any' }), {})] : [])
          : (baseField.type || 'text');
        setNested(schema, baseField.name, value);
      });
    });
    return schema;
  }, [config]);

  if (!isOpen) return null;

  const stepsWithTests = config.steps.filter((step) => !!step.testData);

  const handleAutoFill = (data: Record<string, unknown>) => context.setMultipleValues(data, true);

  const handleFillAll = () => {
    const allData = stepsWithTests.reduce((acc, step) => ({ ...acc, ...step.testData }), {});
    context.setMultipleValues(allData, true);
  };

  const handleClearAll = () => {
    const emptyData = config.steps
      .flatMap((step) => step.groups.flatMap(getAllFieldsDeep))
      .reduce<Record<string, unknown>>((acc, field) => ({ ...acc, [field.name]: emptyValueFor(field) }), {});
    context.setMultipleValues(emptyData, true);
  };

  const handleClearStep = (step: FormStep) => {
    const emptyData = step.groups
      .flatMap(getAllFieldsDeep)
      .reduce<Record<string, unknown>>((acc, field) => ({ ...acc, [field.name]: emptyValueFor(field) }), {});
    context.setMultipleValues(emptyData, true);
  };

  return (
    <DevToolsContainer>
      <HeaderContainer>
        <BugReport color="error" fontSize="small" />
        <Typography variant="subtitle2" color="error.main">DevTools Mode</Typography>
      </HeaderContainer>

      <SectionTitle variant="caption">Ações Globais</SectionTitle>
      <ButtonsContainer>
        <Button variant="outlined" color="error" size="small" startIcon={<DeleteSweep />} onClick={handleClearAll}>Limpar Tudo</Button>
        {stepsWithTests.length > 1 && (
          <Button variant="contained" color="warning" size="small" startIcon={<AutoAwesome />} onClick={handleFillAll}>Preencher Todos os Steps</Button>
        )}
      </ButtonsContainer>

      {stepsWithTests.length > 0 && (
        <>
          <SectionTitle variant="caption">Preenchimento Individual</SectionTitle>
          <ButtonsContainer>
            {stepsWithTests.map((step) => (
              <Button key={`devtools-fill-${step.id}`} variant="outlined" color="warning" size="small" onClick={() => handleAutoFill(step.testData!)}>{step.title}</Button>
            ))}
          </ButtonsContainer>
        </>
      )}

          <SectionTitle variant="caption">Limpeza Individual</SectionTitle>
      <ButtonsContainer>
        {config.steps.map((step) => (
          <Button key={`devtools-clear-${step.id}`} variant="outlined" color="error" size="small" startIcon={<LayersClear />} onClick={() => handleClearStep(step)}>{step.title}</Button>
        ))}
      </ButtonsContainer>

      <SectionTitle variant="caption">Inspecionar</SectionTitle>
      <ButtonsContainer>
        <Button variant="outlined" color="info" size="small" startIcon={<DataObject />} onClick={() => setShowState(!showState)}>{showState ? 'Ocultar Estado' : 'Ver Estado Atual (JSON)'}</Button>
        <Button variant="outlined" color="secondary" size="small" startIcon={<AccountTree />} onClick={() => setShowSchema(!showSchema)}>{showSchema ? 'Ocultar Schema' : 'Ver Schema Esperado (JSON)'}</Button>
      </ButtonsContainer>

      <Collapse in={showState}>
        <StateViewerContainer>
          <pre>{JSON.stringify(context.data, null, 2)}</pre>
        </StateViewerContainer>
      </Collapse>

      <Collapse in={showSchema}>
        <StateViewerContainer>
          <pre>{JSON.stringify(formSchema, null, 2)}</pre>
        </StateViewerContainer>
      </Collapse>

    </DevToolsContainer>
  );
};

export default DevTools;