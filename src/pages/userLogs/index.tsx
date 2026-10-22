import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LoginIcon from '@mui/icons-material/Login'
import HistoryIcon from '@mui/icons-material/History'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'

import { ContainerWrapper, HeaderSection, LogItemCard } from './styles'
import PageContainer from '@components/pageContainer'
import EmptyState from '@components/emptyState'
import { formatCurrency } from '@utils/string'
import useUserLogs from './hook'

const getActionIcon = (action: string) => {
  switch (action) {
    case 'SWEEPSTAKE_JOIN':
      return <ShoppingCartIcon fontSize="small" color="primary" />
    case 'PROFILE_UPDATE':
      return <PersonOutlineIcon fontSize="small" color="secondary" />
    case 'AUTH_LOGIN':
      return <LoginIcon fontSize="small" color="info" />
    default:
      return <HistoryIcon fontSize="small" color="action" />
  }
}

const formatDate = (isoString: string) => {
  try {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch {
    return isoString
  }
}

const UserLogs = () => {
  const navigate = useNavigate()
  const { logs, loading, page, totalPages, total, setPage } = useUserLogs()

  return (
    <PageContainer fullHeight>
      <ContainerWrapper elevation={0}>
        <HeaderSection>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Voltar para a página inicial">
              <IconButton onClick={() => navigate('/')} size="small" sx={{ mr: 0.5 }}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                  Meus Logs de Atividades
                </Typography>
                <Chip
                  label={`${total} ações`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 700, height: 24, fontSize: '0.75rem' }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Histórico de compras de cotas, atualizações de perfil e ações na sua conta
              </Typography>
            </Box>
          </Box>

          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Voltar
          </Button>
        </HeaderSection>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : logs.length === 0 ? (
          <EmptyState
            title="Nenhum log encontrado"
            description="Você ainda não possui registros de ações ou compras de cotas no sistema."
            icon={<HistoryIcon sx={{ fontSize: 48, color: 'text.secondary' }} />}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {logs.map((log) => {
              const suggestedNumbers = log.details?.suggestedNumbers as number[] | undefined
              return (
                <LogItemCard key={log.id} elevation={0}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      {getActionIcon(log.action)}
                      <Typography variant="subtitle2" fontWeight={700}>
                        {log.title}
                      </Typography>
                      {log.targetName && (
                        <Chip
                          size="small"
                          label={log.targetName}
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                        />
                      )}
                    </Box>

                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {formatDate(log.createdAt)}
                    </Typography>
                  </Box>

                  {log.description && (
                    <Typography variant="body2" color="text.secondary">
                      {log.description}
                    </Typography>
                  )}

                  {/* Detalhes específicos (Cotas, Dezenas Indicadas, Valor) */}
                  {log.details && (
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, pt: 0.5 }}>
                      {log.details.quotaCount !== undefined && (
                        <Chip
                          size="small"
                          label={`${log.details.quotaCount} ${log.details.quotaCount === 1 ? 'cota' : 'cotas'}`}
                          color="primary"
                          sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                        />
                      )}
                      {log.details.totalPrice !== undefined && (
                        <Chip
                          size="small"
                          label={`Total: ${formatCurrency(log.details.totalPrice)}`}
                          variant="outlined"
                          sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                        />
                      )}
                      {suggestedNumbers && suggestedNumbers.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                          <Typography variant="caption" fontWeight={600} color="text.secondary">
                            Dezenas indicadas:
                          </Typography>
                          {suggestedNumbers.map((num) => (
                            <Chip
                              key={num}
                              size="small"
                              label={num < 10 ? `0${num}` : num}
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                bgcolor: '#0284c7',
                                color: '#ffffff'
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </LogItemCard>
              )
            })}

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, val) => setPage(val)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </Box>
        )}
      </ContainerWrapper>
    </PageContainer>
  )
}

export default UserLogs
