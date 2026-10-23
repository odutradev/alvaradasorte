import createLogger from '@/utils/logger'

const logger = createLogger('env')

export const MIN_JWT_SECRET_LENGTH = 32

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET

  if (!secret || secret.trim().length < MIN_JWT_SECRET_LENGTH) {
    logger.error('CRITICAL: JWT_SECRET is not defined or has fewer than 32 characters')
    throw new Error('JWT_SECRET is missing or has fewer than 32 characters')
  }

  return secret.trim()
}

export const validateEnv = (): void => {
  const missingOrInvalid: string[] = []

  // 1. JWT Authentication
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    missingOrInvalid.push('JWT_SECRET is required but not defined')
  } else if (jwtSecret.trim().length < MIN_JWT_SECRET_LENGTH) {
    missingOrInvalid.push(
      `JWT_SECRET is insecure: got ${jwtSecret.trim().length} characters, minimum is ${MIN_JWT_SECRET_LENGTH}`
    )
  }

  // 2. Firebase Database & Auth
  const firebaseVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_DATABASE_URL'
  ]
  firebaseVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingOrInvalid.push(`${varName} is required but not defined`)
    }
  })

  // 3. Email Service (Nodemailer)
  const emailVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS']
  emailVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingOrInvalid.push(`${varName} is required but not defined`)
    }
  })

  if (missingOrInvalid.length > 0) {
    logger.error('CRITICAL: Service initialization aborted due to missing or invalid environment variables:')
    missingOrInvalid.forEach((item) => logger.error(`  - ${item}`))
    process.exit(1)
  }
}
