import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

import useAction from '@hooks/useAction'
import { useAuth } from '@hooks/useAuth'

import type { UseLoginReturn, AuthFormData } from './types'

export const useLogin = (): UseLoginReturn => {
  const { loginWithGoogle, loginWithApple, loginWithEmail, user } = useAuth()
  const navigate = useNavigate()

  const handleEmailLogin = async (data: AuthFormData) => {
    await useAction({
      action: async () => await loginWithEmail(data),
      callback: () => navigate('/', { replace: true }),
      toastMessages: {
        success: 'Login realizado com sucesso!',
        error: 'Ocorreu um erro na autenticação.',
        pending: 'Autenticando...'
      }
    })
  }

  const handleGoogleLogin = async () => {
    await useAction({
      action: loginWithGoogle,
      callback: () => navigate('/', { replace: true }),
      toastMessages: {
        success: 'Login realizado com sucesso!',
        error: 'Ocorreu um erro na autenticação.',
        pending: 'Autenticando...'
      }
    })
  }

  const handleAppleLogin = async () => {
    await useAction({
      action: loginWithApple,
      callback: () => navigate('/', { replace: true }),
      toastMessages: {
        success: 'Login realizado com sucesso!',
        error: 'Ocorreu um erro na autenticação.',
        pending: 'Autenticando...'
      }
    })
  }

  const isAuthenticated = useMemo(() => !!user, [user])

  return {
    handleEmailLogin,
    handleGoogleLogin,
    handleAppleLogin,
    isAuthenticated
  }
}