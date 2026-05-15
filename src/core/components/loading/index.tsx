import { CircularProgress } from '@mui/material'

import { LoadingContainer, LoadingMessage } from './styles'

import type { LoadingProps } from './types'

const Loading = ({ showSpinner = true, message = 'Carregando' }: LoadingProps) => {
  return (
    <LoadingContainer>
      {showSpinner ? <CircularProgress color="primary" /> : null}
      <LoadingMessage variant="h6">{message}</LoadingMessage>
    </LoadingContainer>
  )
}

export default Loading
