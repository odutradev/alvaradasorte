import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

import { PageWrapper, ContentContainer, HeaderSection, ListContainer, InfoGrid } from './styles'
import { PresetFormModal } from './components/presetFormModal'
import GridBackground from '@components/gridBackground'
import EmptyState from '@components/emptyState'
import Header from '@components/header'
import { usePresets } from './hook'

export const PresetsPage = () => {
  const { handleDelete, setModalOpen, loadPresets, modalOpen, presets, user } = usePresets()

  if (!user) return null

  return (
    <GridBackground>
      <PageWrapper>
        <Header />
        <ContentContainer>
          <HeaderSection>
            <Typography variant="h4" fontWeight={700} color="primary">
              Predefinições de Pagamento
            </Typography>
            <Button variant="contained" size="large" onClick={() => setModalOpen(true)}>
              Nova Predefinição
            </Button>
          </HeaderSection>
          <ListContainer>
            {presets.map((preset) => (
              <Paper
                key={preset.id}
                elevation={2}
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 2
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {preset.description}
                  </Typography>
                  <InfoGrid>
                    <Typography variant="body2" color="text.secondary">
                      <strong>PIX:</strong> {preset.pix}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Banco:</strong> {preset.bank}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Titular:</strong> {preset.receiverName}
                    </Typography>
                  </InfoGrid>
                </Box>
                <IconButton color="error" onClick={() => handleDelete(preset.id)} size="large" sx={{ ml: 2 }}>
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ))}
            {presets.length === 0 && (
              <EmptyState description="Nenhuma predefinição cadastrada no sistema." />
            )}
          </ListContainer>
        </ContentContainer>
        <PresetFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={loadPresets} />
      </PageWrapper>
    </GridBackground>
  )
}