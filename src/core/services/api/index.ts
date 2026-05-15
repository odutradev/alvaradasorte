import axios from 'axios'

import { firebaseAuth } from '@core/lib/firebase/config'
import defaultConfig from '@core/config/default'

import type { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: defaultConfig.baseURL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(async (config) => {
  const token = await firebaseAuth.currentUser?.getIdToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
