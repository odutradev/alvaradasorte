export interface SocialLoginProps {
  onGoogleLogin: () => Promise<void>
  onAppleLogin: () => Promise<void>
}