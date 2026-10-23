import { useState } from 'react'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import SearchIcon from '@mui/icons-material/Search'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import Accordion from '@mui/material/Accordion'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import { ContainerWrapper, HeaderSection, FiltersBar, LogsListContainer, LogCard, ErrorBox, CodeBlock } from './styles'
import PageContainer from '@components/pageContainer'
import EmptyState from '@components/emptyState'
import { formatCurrency } from '@utils/string'
import useAdminLogs from './hook'

import type { LogLevel } from '@services/logs/types'

const getLevelBadge = (level: LogLevel) => {
  switch (level) {
    case 'error':
      return <Chip size="small" color="error" icon={<ErrorOutlineIcon />} label="ERRO" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 800 }} />
    case 'warn':
      return <Chip size="small" color="warning" icon={<WarningAmberIcon />} label="ALERTA" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 800 }} />
    default:
      return <Chip size="small" color="primary" icon={<CheckCircleIcon />} label="INFO" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 800 }} />
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
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  } catch {
    return isoString
  }
}

const AdminLogs = () => {
  const {
    category,
    level,
    userSearch,
    textSearch,
    page,
    totalPages,
    total,
    logs,
    loading,
    handleCategoryChange,
    handleLevelChange,
    handleUserSearchChange,
    handleTextSearchChange,
    setPage,
    clearFilters
  } = useAdminLogs()

  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({})

  const toggleDetails = (id: string) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const hasActiveFilters = userSearch !== '' || textSearch !== '' || level !== 'all'

  return (
    <PageContainer fullHeight>
      <ContainerWrapper elevation={0}>
        <HeaderSection>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h6" fontWeight={700}>
                Central de Logs e Auditoria
              </Typography>
              <Chip
                label={`${total} registros`}
                size="small"
                color="primary"
                sx={{ fontWeight: 700, height: 24, fontSize: '0.75rem' }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Monitore o fluxo do sistema, auditoria de administradores e histórico dos usuários
            </Typography>
          </Box>
        </HeaderSection>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={category}
            onChange={(_, val) => handleCategoryChange(val)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              value="system"
              icon={<DnsOutlinedIcon />}
              iconPosition="start"
              label="Logs do Sistema & Erros"
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.9rem' }}
            />
            <Tab
              value="admin"
              icon={<AdminPanelSettingsIcon />}
              iconPosition="start"
              label="Logs dos Administradores"
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.9rem' }}
            />
            <Tab
              value="user"
              icon={<PeopleAltIcon />}
              iconPosition="start"
              label="Logs dos Usuários"
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.9rem' }}
            />
          </Tabs>
        </Box>

        <FiltersBar>
          <TextField
            size="small"
            placeholder="Buscar por usuário (nome ou e-mail)..."
            value={userSearch}
            onChange={(e) => handleUserSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonSearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                )
              }
            }}
            sx={{ flex: { xs: '1 1 100%', sm: '1 1 240px' } }}
          />

          <TextField
            size="small"
            placeholder="Buscar por ação, título ou erro..."
            value={textSearch}
            onChange={(e) => handleTextSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                )
              }
            }}
            sx={{ flex: { xs: '1 1 100%', sm: '1 1 240px' } }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={level}
              onChange={(e) => handleLevelChange(e.target.value as any)}
              displayEmpty
            >
              <MenuItem value="all">Todos os Níveis</MenuItem>
              <MenuItem value="info">Apenas Informações (Info)</MenuItem>
              <MenuItem value="warn">Avisos e Alertas (Warn)</MenuItem>
              <MenuItem value="error">Erros do Sistema (Error)</MenuItem>
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <Button
              size="small"
              variant="text"
              color="inherit"
              startIcon={<FilterAltOffIcon fontSize="small" />}
              onClick={clearFilters}
              sx={{ textTransform: 'none', fontSize: '0.8rem' }}
            >
              Limpar filtros
            </Button>
          )}
        </FiltersBar>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : logs.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <EmptyState
              title="Nenhum log encontrado para estes critérios"
              description="Tente ajustar a categoria, remover filtros de busca ou verificar novamente mais tarde."
            />
          </Box>
        ) : (
          <>
            <LogsListContainer>
            {logs.map((log) => {
              const hasCodeDetails = log.details && Object.keys(log.details).length > 0
              const hasStack = Boolean(log.errorStack)
              const isDetailsOpen = expandedDetails[log.id]

              return (
                <LogCard key={log.id} level={log.level} elevation={0}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      {getLevelBadge(log.level)}
                      <Typography variant="subtitle2" fontWeight={800}>
                        {log.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={log.action}
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 600, fontFamily: 'monospace' }}
                      />
                      {log.targetName && (
                        <Chip
                          size="small"
                          label={`Alvo: ${log.targetName}`}
                          color="default"
                          sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 600 }}
                        />
                      )}
                    </Box>

                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {formatDate(log.createdAt)}
                    </Typography>
                  </Box>

                  {(log.userName || log.userEmail) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="caption" color="text.secondary">
                        Usuário: <strong style={{ color: '#38bdf8' }}>{log.userName || 'Sem nome'}</strong>
                      </Typography>
                      {log.userEmail && (
                        <Typography variant="caption" color="text.secondary">
                          ({log.userEmail})
                        </Typography>
                      )}
                      {log.userId && (
                        <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
                          ID: {log.userId}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {log.description && (
                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                      {log.description}
                    </Typography>
                  )}

                  {log.errorMessage && (
                    <ErrorBox>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ErrorOutlineIcon fontSize="small" color="error" />
                        <Typography variant="caption" fontWeight={700} color="error.main">
                          Diagnóstico do Erro:
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600} color="error.dark" sx={{ wordBreak: 'break-word' }}>
                        {log.errorMessage}
                      </Typography>
                    </ErrorBox>
                  )}

                  {(hasCodeDetails || hasStack) && (
                    <Box sx={{ pt: 0.5 }}>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => toggleDetails(log.id)}
                        endIcon={<ExpandMoreIcon sx={{ transform: isDetailsOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />}
                        sx={{ fontSize: '0.75rem', textTransform: 'none', p: 0 }}
                      >
                        {isDetailsOpen ? 'Ocultar detalhes técnicos' : 'Ver detalhes técnicos & payload'}
                      </Button>

                      {isDetailsOpen && (
                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {hasCodeDetails && (
                            <Box>
                              <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                                Payload / Detalhes:
                              </Typography>
                              <CodeBlock>{JSON.stringify(log.details, null, 2)}</CodeBlock>
                            </Box>
                          )}

                          {hasStack && (
                            <Accordion elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                              <AccordionSummary sx={{ p: 0, minHeight: 28 }}>
                                <Typography variant="caption" fontWeight={700} color="error.main">
                                  Ver Stack Trace
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails sx={{ p: 0 }}>
                                <CodeBlock>{log.errorStack}</CodeBlock>
                              </AccordionDetails>
                            </Accordion>
                          )}
                        </Box>
                      )}
                    </Box>
                  )}
                </LogCard>
              )
            })}
            </LogsListContainer>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1, flexShrink: 0 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, val) => setPage(val)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </ContainerWrapper>
    </PageContainer>
  )
}

export default AdminLogs
