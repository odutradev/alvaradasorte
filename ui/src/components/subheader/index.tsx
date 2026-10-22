import { Container, ActionButton, Title } from './styles'

import type { SubheaderProps } from './types'

const Subheader = ({ title, buttonLabel, onButtonClick }: SubheaderProps) => (
  <Container>
    <Title variant="h4" color="primary">
      {title}
    </Title>
    {buttonLabel && onButtonClick && (
      <ActionButton variant="contained" size="large" onClick={onButtonClick}>
        {buttonLabel}
      </ActionButton>
    )}
  </Container>
)

export default Subheader
