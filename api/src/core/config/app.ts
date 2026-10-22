import fs from 'fs'
import path from 'path'

const resolveVersion = (): string => {
  if (process.env.APP_VERSION) return process.env.APP_VERSION
  if (process.env.npm_package_version) return process.env.npm_package_version

  try {
    const rootPkgPath = path.resolve(process.cwd(), '../package.json')
    if (fs.existsSync(rootPkgPath)) {
      const data = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'))
      if (data.version) return data.version
    }
  } catch {
    // ignore
  }

  try {
    const pkgPath = path.resolve(process.cwd(), 'package.json')
    if (fs.existsSync(pkgPath)) {
      const data = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      if (data.version) return data.version
    }
  } catch {
    // ignore
  }

  return '1.0.0'
}

export const appConfig = {
  clusterName: process.env.DB_NAME ?? 'uailab',
  version: resolveVersion(),
  mode: process.env.NODE_ENV ?? 'development',
  logError: {
    message: true,
    data: true
  }
} as const