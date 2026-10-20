import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import Tooltip from '@mui/material/Tooltip'

import useSystemStore from '@stores/system'
import { ToggleButton } from './styles'

const ThemeToggle = () => {
  const { toggleTheme, system } = useSystemStore()
  const isDark = system.themeMode === 'dark'

  return (
    <Tooltip title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}>
      <ToggleButton onClick={toggleTheme} aria-label="Alternar tema">
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </ToggleButton>
    </Tooltip>
  )
}

export default ThemeToggle