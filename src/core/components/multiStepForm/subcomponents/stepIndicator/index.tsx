import { StyledStepper, StyledStep, StyledStepLabel } from './styles';

import type { StepIndicatorProps } from './types';

const StepIndicator = ({ steps, currentStepIndex }: StepIndicatorProps) => {
  if (steps.length <= 1) return null;

  return (
    <StyledStepper activeStep={currentStepIndex} alternativeLabel>
      {steps.map((step) => (
        <StyledStep key={step.id}>
          <StyledStepLabel>{step.title}</StyledStepLabel>
        </StyledStep>
      ))}
    </StyledStepper>
  );
};

export default StepIndicator;