import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

import { firebaseAuth } from '@lib/firebase/config'
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

  const handleEmailRegister = async (data: AuthFormData) => {
    await useAction({
      action: async () => {
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password)
        if (data.name && userCredential.user) {
          await updateProfile(userCredential.user, { displayName: data.name })
        }
      },
      callback: () => navigate('/', { replace: true }),
      toastMessages: {
        success: 'Conta criada com sucesso!',
        error: 'Ocorreu um erro ao criar a conta.',
        pending: 'Criando conta...'
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
    handleEmailRegister,
    handleEmailLogin,
    handleGoogleLogin,
    handleAppleLogin,
    isAuthenticated
  }
}