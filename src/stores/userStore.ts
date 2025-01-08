import type { NavigateFunction } from 'react-router-dom'
import { auth, loginUser, logoutUser, updateDocument } from '@/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'

import { create } from 'zustand'

import { persist } from 'zustand/middleware'

interface UserState {
  user: UserProfile | undefined
  loading: boolean
  error: string | null
  login: (navigate: NavigateFunction) => Promise<void>
  logout: (navigate: NavigateFunction) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  initializeAuthListener: () => void
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: undefined,
      loading: false,
      error: null,

      initializeAuthListener: () => {
        const unsubscribeAuth = onAuthStateChanged(
          auth,
          async (firebaseUser) => {
            set({ loading: true })
            if (firebaseUser) {
              const currentUser = get().user
              set({ user: currentUser || undefined })
            }
            else {
              set({ user: undefined })
            }
            set({ loading: false })
          },
        )

        return unsubscribeAuth
      },

      login: async (navigate) => {
        try {
          set({ loading: true })
          const profile = await loginUser(navigate)
          if (profile) {
            set({
              user: { ...profile },
              error: null,
            })
          }
        }
        catch (error) {
          console.error('Error during login:', error)
          set({ error: 'Login failed. Please try again.' })
        }
        finally {
          set({ loading: false })
        }
      },

      logout: async (navigate) => {
        try {
          set({ loading: true })
          await logoutUser(navigate)

          set({ user: undefined, error: null })
        }
        catch (error) {
          console.error('Error during logout:', error)
          set({ error: 'Logout failed. Please try again.' })
        }
        finally {
          set({ loading: false })
        }
      },

      updateProfile: async (updates) => {
        const currentUser = get().user
        if (!currentUser) {
          console.error('No user is currently logged in.')
          return
        }

        try {
          await updateDocument(currentUser.uid, updates)
          set({
            user: { ...currentUser, ...updates },
            error: null,
          })
        }
        catch (error) {
          console.error('Error updating profile:', error)
          set({ error: 'Profile update failed. Please try again.' })
        }
      },
    }),
    {
      name: 'user-store',
    },
  ),
)

export default useUserStore
