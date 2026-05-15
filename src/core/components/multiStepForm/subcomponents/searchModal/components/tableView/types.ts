import type { SearchResultColumn } from '../../../../types';

export interface TableViewProps {
  onSelect: (item: Record<string, unknown>) => void;
  results: Record<string, unknown>[];
  columns: SearchResultColumn[];
  isLoading: boolean;
}