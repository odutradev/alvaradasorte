import { Collapse, Checkbox, IconButton, Box, CircularProgress, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import { useState, useCallback, useEffect } from 'react';

import { TreeContainer, NodeContainer, NodeText, Spacer, CenterContent, EmptyIcon, EmptyText } from './styles';

import type { TreeViewProps, TreeNodeProps } from './types';

const TreeNode = ({ item, config, level = 0, defaultExpanded = false, onSelect }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded, item]);

  const children = (item[config.childrenKey] as Record<string, unknown>[]) || [];
  const hasChildren = children.length > 0;
  const label = String(item[config.labelKey] || '');
  const value = String(item[config.valueKey] || '');

  const handleToggle = useCallback(() => setIsExpanded((prev) => !prev), []);
  const handleSelect = useCallback(() => onSelect(item), [item, onSelect]);

  return (
    <Box>
      <NodeContainer $level={level}>
        {hasChildren ? (
          <IconButton size="small" onClick={handleToggle}>
            {isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
          </IconButton>
        ) : (
          <Spacer />
        )}
        {!hasChildren && <Checkbox size="small" onChange={handleSelect} />}
        <NodeText variant="body2" $clickable={hasChildren} onClick={hasChildren ? handleToggle : handleSelect}>
          {value} - {label}
        </NodeText>
      </NodeContainer>
      {hasChildren && (
        <Collapse in={isExpanded}>
          {children.map((child, index) => (
            <TreeNode
              key={`${String(child[config.valueKey])}-${index}`}
              defaultExpanded={defaultExpanded}
              onSelect={onSelect}
              level={level + 1}
              config={config}
              item={child}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
};

const TreeView = ({ results, config, isLoading, defaultExpanded = false, onSelect }: TreeViewProps) => {
  if (isLoading) {
    return (
      <TreeContainer>
        <CenterContent>
          <CircularProgress size={40} />
          <Typography variant="body1">Buscando resultados...</Typography>
        </CenterContent>
      </TreeContainer>
    );
  }

  if (!results?.length) {
    return (
      <TreeContainer>
        <CenterContent>
          <EmptyIcon />
          <EmptyText variant="body1">Nenhum resultado encontrado.</EmptyText>
        </CenterContent>
      </TreeContainer>
    );
  }

  return (
    <TreeContainer>
      {results.map((item, index) => (
        <TreeNode
          key={`${String(item[config.valueKey])}-${index}`}
          defaultExpanded={defaultExpanded}
          onSelect={onSelect}
          config={config}
          item={item}
        />
      ))}
    </TreeContainer>
  );
};

export default TreeView;