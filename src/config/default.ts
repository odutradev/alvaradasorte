import packageJson from '../../package.json'

interface DefaultConfig {
  mode: 'developing' | 'production'
  baseURL: string
  version: string
}

const production = import.meta.env.VITE_PRODUCTION == 'true'
const rawBaseURL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_BASEURL || 'http://localhost:5000'
const baseURL = rawBaseURL.replace(/\/+$/, '')

const defaultConfig: DefaultConfig = production
  ? {
      version: packageJson.version,
      mode: 'production',
      baseURL,
    }
  : {
      version: packageJson.version,
      mode: 'developing',
      baseURL,
    }

export default defaultConfig