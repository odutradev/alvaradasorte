import type { TreeConfig } from '../../../../types';

export interface TreeViewProps {
  onSelect: (item: Record<string, unknown>) => void;
  results: Record<string, unknown>[];
  isLoading: boolean;
  config: TreeConfig;
  defaultExpanded?: boolean;
}

export interface TreeNodeProps {
  onSelect: (item: Record<string, unknown>) => void;
  item: Record<string, unknown>;
  config: TreeConfig;
  defaultExpanded?: boolean;
  level?: number;
}