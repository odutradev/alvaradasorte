import { useState, useEffect } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CampaignIcon from '@mui/icons-material/Campaign'
import CasinoIcon from '@mui/icons-material/Casino'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import { StyledTextField } from './styles'
import {
  generateInviteMessage,
  generateGamesMessage,
  generateResultConferenceMessage,
  type MessageType
} from './utils'
import Modal from '@components/modal'

import type { MessageModalProps } from './types'
import type { ChangeEvent } from 'react'

const MessageModal = ({ open, onClose, data, preset }: MessageModalProps) => {
  const [selectedType, setSelectedType] = useState<MessageType>('invite')
  const [messageText, setMessageText] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return

    let generated = ''
    if (selectedType === 'invite') {
      generated = generateInviteMessage(data, preset)
    } else if (selectedType === 'games') {
      generated = generateGamesMessage(data)
    } else if (selectedType === 'result') {
      generated = generateResultConferenceMessage(data)
    }

    setMessageText(generated)
    setCopied(false)
  }, [open, selectedType, data, preset])

  const handleCopyMessage = () => {
    const textarea = document.createElement('textarea')
    textarea.value = messageText
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, 99999)
    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
    }
    document.body.removeChild(textarea)
  }

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value)
  }

  const handleClose = () => {
    onClose()
    setCopied(false)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      title="Mensagens do Bolão"
      subtitle="Escolha o modelo de mensagem para compartilhar no WhatsApp dos participantes"
      disableEnforceFocus
      actions={
        <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button onClick={handleClose} color="inherit">
            Fechar
          </Button>

          <Button
            onClick={handleCopyMessage}
            variant="contained"
            color={copied ? 'success' : 'primary'}
            startIcon={<ContentCopyIcon fontSize="small" />}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 2.5 }}
          >
            {copied ? 'Copiado!' : 'Copiar Mensagem'}
          </Button>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedType}
            onChange={(_, val) => setSelectedType(val)}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab
              value="invite"
              icon={<CampaignIcon fontSize="small" />}
              iconPosition="start"
              label="Chamando pro Bolão"
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' }}
            />
            <Tab
              value="games"
              icon={<CasinoIcon fontSize="small" />}
              iconPosition="start"
              label="Jogos Realizados"
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' }}
            />
            <Tab
              value="result"
              icon={<CheckCircleIcon fontSize="small" />}
              iconPosition="start"
              label="Resultado & Acertos"
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' }}
            />
          </Tabs>
        </Box>

        <Typography variant="caption" color="text.secondary">
          {selectedType === 'invite' && 'Mensagem de divulgação para chamar participantes com dados do PIX e regras.'}
          {selectedType === 'games' && 'Mensagem com a lista de todos os jogos oficiais registrados na lotérica.'}
          {selectedType === 'result' && 'Mensagem pós-sorteio com as dezenas sorteadas e os acertos destacados em cada jogo.'}
        </Typography>

        <StyledTextField
          multiline
          fullWidth
          minRows={10}
          maxRows={16}
          value={messageText}
          onChange={handleTextChange}
          variant="outlined"
          placeholder="A mensagem gerada aparecerá aqui..."
        />
      </Box>
    </Modal>
  )
}

export default MessageModal