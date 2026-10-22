import fs from 'fs'
import path from 'path'

const resolveVersion = (): string => {
  try {
    const dockerPkgPath = path.resolve(process.cwd(), 'root-package.json')
    if (fs.existsSync(dockerPkgPath)) {
      const data = JSON.parse(fs.readFileSync(dockerPkgPath, 'utf8'))
      if (data.version) return data.version
    }
  } catch {}

  try {
    const rootPkgPath = path.resolve(process.cwd(), '../package.json')
    if (fs.existsSync(rootPkgPath)) {
      const data = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'))
      if (data.version) return data.version
    }
  } catch {}

  try {
    const pkgPath = path.resolve(process.cwd(), 'package.json')
    if (fs.existsSync(pkgPath)) {
      const data = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      if (data.version) return data.version
    }
  } catch {}

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