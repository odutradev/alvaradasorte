import type { FormModalConfig, ActionContext } from '../../types';

export interface FormModalProps {
  config: FormModalConfig;
  context: ActionContext;
  onClose: () => void;
  initialValues?: Record<string, unknown>;
}
