import { Stepper, Step, StepLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const StyledStep = styled(Step)({});
export const StyledStepLabel = styled(StepLabel)({});