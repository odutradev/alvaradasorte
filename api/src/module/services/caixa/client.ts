import { execSync } from 'child_process'
import axios, { type AxiosInstance, type AxiosProxyConfig } from 'axios'
import createLogger from '@core/utils/logger'

const logger = createLogger('caixa-client')

let cachedProxyConfig: AxiosProxyConfig | false | null = null

export const resolveProxyConfig = (): AxiosProxyConfig | false => {
  if (cachedProxyConfig !== null) {
    return cachedProxyConfig
  }

  const rawEnvProxy =
    process.env.CAIXA_PROXY ||
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy

  let proxyUrl = rawEnvProxy?.trim()

  if (!proxyUrl && process.platform === 'win32') {
    try {
      const output = execSync('netsh winhttp show proxy', {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        timeout: 2000
      })
      const match =
        output.match(/Servidor\(es\)\s*Proxy\s*:\s*([^\r\n]+)/i) ||
        output.match(/Proxy\s*Server\(s\)\s*:\s*([^\r\n]+)/i)

      if (match && match[1]) {
        const candidate = match[1].trim()
        if (candidate && !candidate.toLowerCase().includes('direto') && !candidate.toLowerCase().includes('direct')) {
          proxyUrl = candidate.startsWith('http') ? candidate : `http://${candidate}`
          logger.info(`[caixa-client] Proxy do sistema detectado automaticamente via WinHTTP: ${proxyUrl}`)
        }
      }
    } catch (err) {
      logger.warn('[caixa-client] Não foi possível verificar o proxy WinHTTP:', (err as Error)?.message)
    }
  }

  if (!proxyUrl) {
    cachedProxyConfig = false
    return false
  }

  try {
    const parsed = new URL(proxyUrl)
    cachedProxyConfig = {
      protocol: parsed.protocol.replace(':', ''),
      host: parsed.hostname,
      port: Number(parsed.port) || 3128,
      ...(parsed.username
        ? {
            auth: {
              username: decodeURIComponent(parsed.username),
              password: decodeURIComponent(parsed.password)
            }
          }
        : {})
    }
    return cachedProxyConfig
  } catch (err) {
    logger.warn(`[caixa-client] Formato de URL de proxy inválido: "${proxyUrl}"`, (err as Error)?.message)
    cachedProxyConfig = false
    return false
  }
}

export const createCaixaClient = (): AxiosInstance => {
  const proxy = resolveProxyConfig()

  return axios.create({
    proxy: proxy || undefined,
    timeout: 12000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'application/json, text/plain, */*'
    }
  })
}
