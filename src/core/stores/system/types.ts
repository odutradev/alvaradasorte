export interface SystemStoreData {
  sidebarOpen: boolean
  loading: boolean
}

export interface SystemStore {
  updateSystem: (partialSystem: Partial<SystemStoreData>) => void
  setSystem: (system: SystemStoreData) => void
  setLoading: (currentLoading?: boolean) => void
  system: SystemStoreData
  toggleSidebar: () => void
  reset: () => void
}