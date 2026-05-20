import { BackgroundWrapper } from './styles'

import type { GridBackgroundProps } from './types'

export const GridBackground = ({ children }: GridBackgroundProps) => (
  <BackgroundWrapper>{children}</BackgroundWrapper>
)