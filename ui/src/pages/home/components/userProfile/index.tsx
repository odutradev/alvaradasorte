import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockResetIcon from '@mui/icons-material/LockReset'
import PersonPinIcon from '@mui/icons-material/PersonPin'
import GoogleIcon from '@mui/icons-material/Google'
import LogoutIcon from '@mui/icons-material/Logout'
import AppleIcon from '@mui/icons-material/Apple'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import HistoryIcon from '@mui/icons-material/History'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import {
  ProfileCard,
  StyledAvatar,
  InfoContainer,
  InfoRow,
  ValueText,
  ActionsContainer,
  LogsButton,
  EditProfileButton,
  LogoutButton,
  ProviderRow,
  IconWrapper,
  IncompleteAlert
} from './styles'
import { requestPasswordReset } from '@services/auth/passwordReset'
import { capitalizeWords } from '@utils/string'
import useAction from '@hooks/useAction'
import Modal from '@components/modal'
import useAuth from '@hooks/useAuth'

import type { UserProfileProps } from './types'
import type { JSX } from 'react'

const PROVIDER_ICON_MAP: Record<string, JSX.Element> = {
  'google.com': <GoogleIcon fontSize="small" />,
  'apple.com': <AppleIcon fontSize="small" />,
  'password': <EmailOutlinedIcon fontSize="small" />
}

const PROVIDER_LABEL_MAP: Record<string, string> = {
  'google.com': 'Google',
  'apple.com': 'Apple',
  'password': 'E-mail e Senha'
}

const ROLE_ICON_MAP: Record<string, JSX.Element> = {
  'admin': <AdminPanelSettingsIcon fontSize="small" />,
  'normal': <PersonPinIcon fontSize="small" />
}

const ROLE_LABEL_MAP: Record<string, string> = {
  'admin': 'Administrador',
  'normal': 'Padrão'
}

const UserProfile = ({ onEditProfile, isProfileIncomplete, sweepstakes, user }: UserProfileProps) => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)

  const displayName = user.fullName ?? user.name
  const initials = displayName?.substring(0, 2).toUpperCase() ?? 'UN'
  const providerIcon = PROVIDER_ICON_MAP[user.authProviderId] ?? <EmailOutlinedIcon fontSize="small" />
  const providerLabel = PROVIDER_LABEL_MAP[user.authProviderId] ?? user.authProviderId
  const roleLabel = ROLE_LABEL_MAP[user.role]
  const roleIcon = ROLE_ICON_MAP[user.role]

  const totalUserQuotas = sweepstakes?.reduce((sum, s) => sum + (s.userParticipation?.quotaCount ?? 0), 0) ?? 0

  const handleConfirmPasswordReset = async () => {
    setIsSendingReset(true)
    await useAction({
      action: async () => await requestPasswordReset({ email: user.email }),
      callback: () => {
        setIsResetModalOpen(false)
      },
      toastMessages: {
        pending: 'Enviando link de redefinição para seu e-mail...',
        success: 'Link de redefinição enviado para o seu e-mail!',
        error: 'Erro ao enviar e-mail de redefinição de senha.'
      }
    })
    setIsSendingReset(false)
  }

  return (
    <>
      <ProfileCard elevation={0}>
        <StyledAvatar src={user.photoUrl}>
          {initials}
        </StyledAvatar>
        <ProviderRow>
          <Tooltip title={`Login via ${providerLabel}`}>
            <IconWrapper>
              {providerIcon}
            </IconWrapper>
          </Tooltip>
          <Tooltip title={`Usuário ${roleLabel}`}>
            <IconWrapper>
              {roleIcon}
            </IconWrapper>
          </Tooltip>
        </ProviderRow>
        {displayName && (
          <Typography variant="subtitle1" fontWeight={600} align="center">
            {capitalizeWords(displayName)}
          </Typography>
        )}
        {isProfileIncomplete && (
          <IncompleteAlert severity="warning">
            Complete seu perfil para participar dos bolões.
          </IncompleteAlert>
        )}
        <InfoContainer>
          <InfoRow>
            <Typography variant="body2" color="text.secondary">Minhas Cotas</Typography>
            <ValueText variant="body1" fontWeight={700} color="primary.main">
              {totalUserQuotas} {totalUserQuotas === 1 ? 'cota' : 'cotas'}
            </ValueText>
          </InfoRow>
          <InfoRow>
            <Typography variant="body2" color="text.secondary">E-mail</Typography>
            <ValueText variant="body1" fontWeight={500}>{user.email.toLocaleLowerCase()}</ValueText>
          </InfoRow>
          <InfoRow>
            <Typography variant="body2" color="text.secondary">Telefone</Typography>
            <ValueText variant="body1" fontWeight={500}>{user.phone ?? 'Não informado'}</ValueText>
          </InfoRow>
          <InfoRow>
            <Typography variant="body2" color="text.secondary">Setor</Typography>
            <ValueText variant="body1" fontWeight={500}>{capitalizeWords(user.department ?? 'Não informado')}</ValueText>
          </InfoRow>
          <InfoRow>
            <Typography variant="body2" color="text.secondary">Notificação de Resultados</Typography>
            <ValueText
              variant="body2"
              fontWeight={600}
              color={user.notifySweepstakeResult !== false ? 'success.main' : 'text.disabled'}
            >
              {user.notifySweepstakeResult !== false ? 'Ativado por e-mail' : 'Desativado'}
            </ValueText>
          </InfoRow>
        </InfoContainer>
        <ActionsContainer>
          <LogsButton
            variant="contained"
            color="primary"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/my-logs')}
          >
            Meus Logs de Ações
          </LogsButton>
          <EditProfileButton
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={onEditProfile}
          >
            Editar Perfil
          </EditProfileButton>
          <EditProfileButton
            variant="outlined"
            color="primary"
            startIcon={<LockResetIcon />}
            onClick={() => setIsResetModalOpen(true)}
          >
            Redefinir Senha
          </EditProfileButton>
          <LogoutButton
            variant="text"
            startIcon={<LogoutIcon />}
            onClick={logout}
          >
            Sair
          </LogoutButton>
        </ActionsContainer>
      </ProfileCard>

      <Modal
        open={isResetModalOpen}
        onClose={() => !isSendingReset && setIsResetModalOpen(false)}
        maxWidth="xs"
        title="Redefinir Senha"
        subtitle="Confirmação de envio por e-mail"
        actions={
          <>
            <Button onClick={() => setIsResetModalOpen(false)} color="inherit" disabled={isSendingReset}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmPasswordReset}
              variant="contained"
              color="primary"
              disabled={isSendingReset}
            >
              {isSendingReset ? 'Enviando...' : 'Enviar Link'}
            </Button>
          </>
        }
      >
        <Typography variant="body2" color="text.secondary">
          Enviaremos um link de redefinição de senha para o seu e-mail cadastrado:{' '}
          <Typography component="span" fontWeight={700} color="text.primary">
            {user.email.toLocaleLowerCase()}
          </Typography>
          . Deseja continuar?
        </Typography>
      </Modal>
    </>
  )
}

export default UserProfile
