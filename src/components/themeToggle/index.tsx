import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

import useSystemStore from '../../stores/system'

import { ToggleButton } from './styles'

export const ThemeToggle = () => {
  const { toggleTheme, system } = useSystemStore()
  const isDark = system.themeMode === 'dark'

  return (
    <ToggleButton onClick={toggleTheme} aria-label="Alternar tema">
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </ToggleButton>
  )
}