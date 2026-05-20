import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

import useSystemStore from '@stores/system'
import { ToggleButton } from './styles'

const ThemeToggle = () => {
  const { toggleTheme, system } = useSystemStore()
  const isDark = system.themeMode === 'dark'

  return (
    <ToggleButton onClick={toggleTheme} aria-label="Alternar tema">
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </ToggleButton>
  )
}

export default ThemeToggle