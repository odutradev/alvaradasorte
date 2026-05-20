import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'

import { systemStoreDefaultValues } from './defaultValues'

import type { SystemStore } from './types'

const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      system: systemStoreDefaultValues,
      setSystem: (system) => set({ system }),
      updateSystem: (partialSystem) =>
        set((state) => ({
          system: {
            ...state.system,
            ...partialSystem
          }
        })),
      setLoading: (currentLoading?: boolean) =>
        set((state) => ({
          system: {
            ...state.system,
            loading: currentLoading ?? !state.system.loading
          }
        })),
      toggleSidebar: () =>
        set((state) => ({
          system: {
            ...state.system,
            sidebarOpen: !state.system.sidebarOpen
          }
        })),
      reset: () => {
        set({ system: systemStoreDefaultValues })
        localStorage.removeItem('system-store')
      }
    }),
    {
      name: 'system-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useSystemStore