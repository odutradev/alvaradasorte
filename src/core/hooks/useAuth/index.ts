import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, updateProfile, signInWithPopup, OAuthProvider, signOut } from 'firebase/auth'
import { useCallback, useEffect } from 'react'

import { firebaseAuth } from '@core/lib/firebase/config'
import { syncAuthUser } from '@core/services/auth/sync'
import useAuthStore from '@core/stores/auth'

import type { RegisterCredentials, LoginCredentials, UseAuthReturn } from './types'
import type { User } from 'firebase/auth'

export const useAuth = (): UseAuthReturn => {
  const { setAuthUser, setLoading, clearAuth, auth } = useAuthStore()

  const handleSync = useCallback(async (firebaseUser: User, providerId?: string, overrideName?: string) => {
    const token = await firebaseUser.getIdToken()
    const payload = {
      authProviderId: providerId ?? firebaseUser.providerData[0]?.providerId ?? 'password',
      name: overrideName ?? firebaseUser.displayName ?? undefined,
      photoUrl: firebaseUser.photoURL ?? undefined,
      email: firebaseUser.email ?? undefined
    }
    const backendUser = await syncAuthUser(payload, token)
    setAuthUser(backendUser)
  }, [setAuthUser])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (!currentUser) {
        clearAuth()
        return
      }
      try {
        await handleSync(currentUser)
      } catch {
        clearAuth()
      }
    })
    return unsubscribe
  }, [handleSync, clearAuth])

  const loginWithEmail = async ({ email, password }: LoginCredentials) => {
    const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password)
    await handleSync(user, 'password')
  }

  const registerWithEmail = async ({ password, email, name }: RegisterCredentials) => {
    const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password)
    await updateProfile(user, { displayName: name })
    await handleSync(user, 'password', name)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const { user } = await signInWithPopup(firebaseAuth, provider)
    await handleSync(user, 'google.com')
  }

  const loginWithApple = async () => {
    const provider = new OAuthProvider('apple.com')
    const { user } = await signInWithPopup(firebaseAuth, provider)
    await handleSync(user, 'apple.com')
  }

  const logout = async () => {
    setLoading(true)
    await signOut(firebaseAuth)
    clearAuth()
  }

  return {
    registerWithEmail,
    loginWithGoogle,
    loading: auth.loading,
    loginWithApple,
    loginWithEmail,
    user: auth.user,
    logout
  }
}