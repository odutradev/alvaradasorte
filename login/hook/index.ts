import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

import { firebaseAuth } from '@lib/firebase/config'
import useAction from '@hooks/useAction'
import { useAuth } from '@hooks/useAuth'

import type { UseLoginReturn, AuthFormData, LoginMode } from './types'

const AUTH_TOAST = {
  success: 'Login realizado com sucesso!',
  error: 'Ocorreu um erro na autenticação.',
  pending: 'Autenticando...'
}

const REGISTER_TOAST = {
  success: 'Conta criada com sucesso!',
  error: 'Ocorreu um erro ao criar a conta.',
  pending: 'Criando conta...'
}

const useLogin = (): UseLoginReturn => {
  const { loginWithGoogle, loginWithApple, loginWithEmail, user } = useAuth()
  const [mode, setMode] = useState<LoginMode>('login')
  const navigate = useNavigate()

  const navigateHome = () => navigate('/', { replace: true })

  const toggleMode = () => setMode((prev) => (prev === 'login' ? 'register' : 'login'))

  const handleEmailLogin = async (data: AuthFormData) => {
    await useAction({
      action: async () => await loginWithEmail(data),
      callback: navigateHome,
      toastMessages: AUTH_TOAST
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
      callback: navigateHome,
      toastMessages: REGISTER_TOAST
    })
  }

  const handleGoogleLogin = async () => {
    await useAction({
      action: loginWithGoogle,
      callback: navigateHome,
      toastMessages: AUTH_TOAST
    })
  }

  const handleAppleLogin = async () => {
    await useAction({
      action: loginWithApple,
      callback: navigateHome,
      toastMessages: AUTH_TOAST
    })
  }

  const isAuthenticated = useMemo(() => !!user, [user])

  return {
    handleEmailRegister,
    handleEmailLogin,
    handleGoogleLogin,
    handleAppleLogin,
    isAuthenticated,
    toggleMode,
    mode
  }
}

export default useLogin
