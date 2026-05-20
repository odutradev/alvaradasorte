import axios from 'axios'

import useAuthStore from '@stores/auth'

import type { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: 'https://api.alvaradasorte.odutra.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState().auth
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api