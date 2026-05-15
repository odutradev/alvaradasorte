import { Dialog, DialogTitle, DialogActions, Button, TextField, CircularProgress, TablePagination } from '@mui/material';
import { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import { Search } from '@mui/icons-material';
import { IMaskInput } from 'react-imask';

import { FiltersContainer, ContentContainer, ModalContainer, SearchButton } from './styles';
import TableView from './components/tableView';
import TreeView from './components/treeView';

import type { ChangeEvent, ElementType, KeyboardEvent } from 'react';
import type { SearchModalProps, MaskedInputProps } from './types';
import type { InputBaseComponentProps } from '@mui/material';

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

const SearchModal = ({ config, context, onClose, initialValue }: SearchModalProps) => {
  const initialSearchDone = useRef(false);
  const [filters, setFilters] = useState<Record<string, unknown>>(() => {
    if (initialValue && config.initialFilterName) return { [config.initialFilterName]: initialValue };
    return {};
  });
  const [results, setResults] = useState<Record<string, unknown>[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);

  const handleFilterChange = useCallback((e: ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSearch = useCallback(async (searchFilters?: Record<string, unknown>) => {
    setIsLoading(true);
    setPage(0);
    try {
      const data = await config.onSearch(searchFilters || filters);
      setResults(data);
    } finally {
      setIsLoading(false);
    }
  }, [config, filters]);

  const handleSelect = useCallback((item: Record<string, unknown>) => {
    config.onSelect(item, context);
    onClose();
  }, [config, context, onClose]);

  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }, []);

  useEffect(() => {
    if (!initialSearchDone.current) {
      initialSearchDone.current = true;
      if (initialValue && config.initialFilterName) {
        handleSearch({ [config.initialFilterName]: initialValue });
        return;
      }
      if (config.autoSearchOnOpen !== false) {
        handleSearch();
      }
    }
  }, [initialValue, config.initialFilterName, config.autoSearchOnOpen, handleSearch]);

  const displayedResults = config.pagination ? results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : results;
  const isTreeView = config.viewMode === 'tree' && config.treeConfig;
  const hasActiveFilters = Object.values(filters).some((val) => val !== '' && val !== undefined && val !== null);

  return (
    <Dialog open maxWidth="lg" fullWidth onClose={onClose}>
      <ModalContainer>
        <DialogTitle>{config.title}</DialogTitle>
        <ContentContainer dividers>
          <FiltersContainer>
            {config.fields.map((field) => (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                value={(filters[field.name] as string) || ''}
                fullWidth
                disabled={isLoading}
                onChange={handleFilterChange}
                onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const target = e.target as HTMLInputElement;
                    const updatedFilters = { ...filters, [target.name]: target.value };
                    setFilters(updatedFilters);
                    handleSearch(updatedFilters);
                  }
                }}
                InputProps={{
                  ...(field.mask && { inputComponent: MaskedInput as ElementType<InputBaseComponentProps> })
                }}
                inputProps={field.mask ? { maskPattern: field.mask } : undefined}
              />
            ))}
            <SearchButton variant="contained" disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Search />} onClick={() => handleSearch()}>
              Buscar
            </SearchButton>
          </FiltersContainer>

          {isTreeView ? (
            <TreeView
              results={results}
              config={config.treeConfig!}
              isLoading={isLoading}
              onSelect={handleSelect}
              defaultExpanded={hasActiveFilters}
            />
          ) : (
            <TableView
              results={displayedResults}
              columns={config.columns}
              isLoading={isLoading}
              onSelect={handleSelect}
            />
          )}

          {config.pagination && !isTreeView && results.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={results.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          )}
        </ContentContainer>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Fechar
          </Button>
        </DialogActions>
      </ModalContainer>
    </Dialog>
  );
};

export default SearchModal;