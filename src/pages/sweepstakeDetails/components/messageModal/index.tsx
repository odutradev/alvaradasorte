import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'

import { StyledTextField } from './styles'
import { generateSweepstakeMessage } from './utils'
import Modal from '@components/modal'

import type { MessageModalProps } from './types'
import type { ChangeEvent } from 'react'

const MessageModal = ({ open, onClose, data, preset }: MessageModalProps) => {
  const [messageText, setMessageText] = useState('')
  const [copied, setCopied] = useState(false)

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

  useEffect(() => {
    if (!open) return
    setMessageText(generateSweepstakeMessage(data, preset))
  }, [open, data, preset])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="md"
      title="Mensagem do Bolão"
      subtitle="Copie o texto formatado para compartilhar com os participantes"
      disableEnforceFocus
      actions={
        <>
          <Button onClick={handleCopyMessage} variant="contained" color={copied ? 'success' : 'primary'}>
            {copied ? 'Copiado!' : 'Copiar Mensagem'}
          </Button>
          <Button onClick={handleClose} color="inherit">
            Fechar
          </Button>
        </>
      }
    >
      <StyledTextField
        multiline
        fullWidth
        rows={12}
        variant="outlined"
        value={messageText}
        onChange={handleTextChange}
      />
    </Modal>
  )
}

export default MessageModal