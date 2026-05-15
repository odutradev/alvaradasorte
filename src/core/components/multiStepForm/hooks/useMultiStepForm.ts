import { useState, useEffect, useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'

import type { MultiStepFormProps, FormAction, FormGroup, FormField } from '../types'
import type { FieldValues } from 'react-hook-form'

const getAllFields = (group: FormGroup): FormField[] => {
  if (group.subGroups?.length) {
    return group.subGroups.flatMap(getAllFields)
  }
  return group.fields
}

const getByPath = (source: Record<string, unknown>, path: string): unknown => {
  if (path in source) return source[path]
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return (acc as Record<string, unknown>)[key]
  }, source)
}

export const useMultiStepForm = ({ config, initialData, onSubmit }: MultiStepFormProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isActionLoading, setIsActionLoading] = useState(false)

  const { watch, trigger, control, getValues, setValue, setError, clearErrors, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: initialData,
    mode: 'onChange'
  })

  const allData = watch()

  const setMultipleValues = useCallback((values: Record<string, unknown>, shouldClearErrors: boolean = true) => {
    Object.entries(values).forEach(([key, value]) => setValue(key, value))
    if (shouldClearErrors) clearErrors(Object.keys(values))
  }, [setValue, clearErrors])

  const formMethods = useMemo(() => ({
    setMultipleValues,
    clearErrors,
    getValues,
    setError,
    setValue
  }), [setMultipleValues, clearErrors, getValues, setError, setValue])

  const actionContext = useMemo(() => ({ data: allData, ...formMethods }), [allData, formMethods])

  useEffect(() => {
    const fieldsToClear: string[] = []
    const visibleFieldNames = new Set<string>()
    const errorsToClear: string[] = []

    config.steps.forEach((step) => {
      const isStepVisible = step.conditionalRender ? step.conditionalRender(actionContext) : true
      if (!isStepVisible) {
        step.groups.forEach((g) => getAllFields(g).forEach((f) => fieldsToClear.push(f.name)))
        return
      }
      step.groups.forEach((group) => {
        const isGroupVisible = group.conditionalRender ? group.conditionalRender(actionContext) : true
        if (!isGroupVisible) {
          getAllFields(group).forEach((f) => fieldsToClear.push(f.name))
          return
        }
        getAllFields(group).forEach((field) => {
          const isFieldVisible = field.conditionalRender ? field.conditionalRender(actionContext) : true
          if (!isFieldVisible) {
            fieldsToClear.push(field.name)
            return
          }
          visibleFieldNames.add(field.name)
          if (typeof field.required === 'function' && !field.required(actionContext)) {
            const hasError = !!getByPath(errors as Record<string, unknown>, field.name)
            if (hasError) errorsToClear.push(field.name)
          }
        })
      })
    })

    fieldsToClear
      .filter((name) => !visibleFieldNames.has(name))
      .forEach((name) => {
        const value = getValues(name)
        if (value !== undefined && value !== null && value !== '') {
          setValue(name, undefined)
          clearErrors(name)
        }
      })

    if (errorsToClear.length > 0) clearErrors(errorsToClear)
  }, [config.steps, actionContext, getValues, setValue, clearErrors, errors])

  const visibleSteps = useMemo(() => config.steps.filter((s) => (s.conditionalRender ? s.conditionalRender(actionContext) : true)), [config.steps, actionContext])

  useEffect(() => {
    if (currentStepIndex >= visibleSteps.length && visibleSteps.length > 0) {
      setCurrentStepIndex(visibleSteps.length - 1)
    }
  }, [visibleSteps.length, currentStepIndex])

  const currentStep = useMemo(() => visibleSteps[currentStepIndex] || visibleSteps[0], [visibleSteps, currentStepIndex])
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === visibleSteps.length - 1

  const isStepReadOnly = useMemo(() => {
    if (!currentStep) return false
    return typeof currentStep.readOnly === 'function' ? currentStep.readOnly(actionContext) : !!currentStep.readOnly
  }, [currentStep, actionContext])

  const resolveFields = useCallback((fields: FormField[]) =>
    fields
      .filter((f) => (f.conditionalRender ? f.conditionalRender(actionContext) : true))
      .map((f) => {
        const baseField = f.preSet && config.fieldPreSets?.[f.preSet] ? { ...config.fieldPreSets[f.preSet], ...f } : f
        if (baseField.searchConfig?.fields) {
          return {
            ...baseField,
            searchConfig: {
              ...baseField.searchConfig,
              fields: baseField.searchConfig.fields.map((sf) =>
                sf.preSet && config.fieldPreSets?.[sf.preSet] ? { ...config.fieldPreSets[sf.preSet], ...sf } : sf
              )
            }
          }
        }
        return baseField
      }),
  [actionContext, config.fieldPreSets])

  const visibleGroups = useMemo(() => {
    if (!currentStep) return []
    return currentStep.groups
      .filter((g) => (g.conditionalRender ? g.conditionalRender(actionContext) : true))
      .map((g) => ({
        ...g,
        fields: resolveFields(g.fields),
        ...(g.subGroups?.length && {
          subGroups: g.subGroups
            .filter((sg) => (sg.conditionalRender ? sg.conditionalRender(actionContext) : true))
            .map((sg) => ({
              ...sg,
              fields: resolveFields(sg.fields)
            }))
        })
      }))
  }, [currentStep, actionContext, resolveFields])

  const currentFieldsToValidate = useMemo(() => visibleGroups.flatMap((g) => getAllFields(g)).filter((f) => f.type !== 'info' && f.type !== 'divider'), [visibleGroups])
  const currentFieldNames = useMemo(() => currentFieldsToValidate.map((f) => f.name), [currentFieldsToValidate])

  const isCurrentStepValid = useMemo(() => {
    const hasErrors = currentFieldNames.some((name) => !!errors[name])
    const hasMissingRequired = currentFieldsToValidate.some((field) => {
      const value = getByPath(allData as Record<string, unknown>, field.name)
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      const isRequired = typeof field.required === 'function' ? field.required(actionContext) : !!field.required
      return isRequired && isEmpty
    })
    return !hasErrors && !hasMissingRequired
  }, [currentFieldsToValidate, currentFieldNames, allData, errors, actionContext])

  const executeAction = useCallback(async (action: FormAction) => {
    if (action.actionType === 'next') {
      const isStepValid = await trigger(currentFieldNames)
      if (!isStepValid) return
    }

    setIsActionLoading(true)
    try {
      if (action.onClick) {
        const result = await action.onClick(actionContext)
        if (result === false) return
      }

      if (action.actionType === 'next' && !isLastStep) setCurrentStepIndex((prev) => prev + 1)
      if (action.actionType === 'prev' && !isFirstStep) setCurrentStepIndex((prev) => Math.max(0, prev - 1))
      if (action.actionType === 'submit') await handleSubmit((data) => onSubmit(data))()
    } finally {
      setIsActionLoading(false)
    }
  }, [trigger, currentFieldNames, actionContext, isLastStep, isFirstStep, handleSubmit, onSubmit])

  return {
    control,
    currentStep,
    actionContext,
    visibleSteps,
    visibleGroups,
    executeAction,
    isStepReadOnly,
    isActionLoading,
    currentStepIndex,
    isCurrentStepValid
  }
}