import type { ActionContext, FormConfig } from '../../types';

export interface DevToolsProps {
  context: ActionContext;
  config: FormConfig;
  isOpen: boolean;
}