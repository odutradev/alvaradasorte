export interface HeaderProps {
  onLogout: () => Promise<void>
  userRole: string
}