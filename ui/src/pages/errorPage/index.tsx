import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import { PageContainer, ContentWrapper } from '@pages/notFound/styles'

const ErrorPage = () => {
  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 1 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Ops! Algo deu errado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mb: 3 }}>
          Ocorreu uma instabilidade inesperada. Você pode tentar recarregar a página ou voltar ao início.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="outlined" color="inherit" onClick={handleReload} size="medium">
            Recarregar página
          </Button>
          <Button variant="contained" color="primary" onClick={handleGoHome} size="medium">
            Voltar para o Início
          </Button>
        </Box>
      </ContentWrapper>
    </PageContainer>
  )
}

export default ErrorPage
