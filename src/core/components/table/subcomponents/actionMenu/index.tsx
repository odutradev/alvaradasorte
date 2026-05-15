import { Menu, MenuItem } from '@mui/material'

import { ActionText } from './styles'

import type { ActionMenuProps } from './types'

const ActionMenu = <T extends { id: string | number }>({ onActionClick, selectedRow, anchorEl, actions, onClose }: ActionMenuProps<T>) => {
  if (!actions || actions.length === 0) return null

  return (
    <Menu
      anchorEl={anchorEl}
      onClose={onClose}
      open={!!anchorEl}
    >
      {actions.map((action, index) => (
        <MenuItem
          disabled={action.disabled && selectedRow ? action.disabled(selectedRow) : false}
          onClick={() => onActionClick(action.onClick)}
          key={index}
        >
          {action.icon}
          <ActionText>{action.label}</ActionText>
        </MenuItem>
      ))}
    </Menu>
  )
}

export default ActionMenu