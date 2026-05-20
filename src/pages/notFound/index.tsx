import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { PageContainer, ContentWrapper } from './styles'

import type { NotFoundProps } from './types'

const NotFound = (props: NotFoundProps) => {
  const navigate = useNavigate()

  const handleGoHome = () => navigate('/')

  return (
    <PageContainer>
      <ContentWrapper>
        <Typography variant="h1" color="primary" fontWeight={700}>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Página não encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          O recurso que você está tentando acessar não existe ou foi movido.
        </Typography>
        <Button variant="contained" onClick={handleGoHome} size="large">
          Voltar para o Início
        </Button>
      </ContentWrapper>
    </PageContainer>
  )
}

export default NotFound