import type { FormStep } from '../../types';

export interface StepIndicatorProps {
  steps: FormStep[];
  currentStepIndex: number;
}