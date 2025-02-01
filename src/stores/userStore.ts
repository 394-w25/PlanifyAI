import type { NavigateFunction } from 'react-router-dom'
import { auth, loginUser, logoutUser, updateDocument } from '@/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { toast } from 'sonner'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import useScheduleStore from './scheduleStore'

interface UserState {
  user: UserProfile | undefined
  loading: boolean
  error: string | null
  login: (navigate: NavigateFunction) => Promise<void>
  logout: (navigate: NavigateFunction) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  initializeAuthListener: () => () => void
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: undefined,
      loading: false,
      error: null,

      initializeAuthListener: () => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
          set({ loading: true, error: null })

          if (firebaseUser) {
            const currentUser = get().user
            const { fetchSchedule } = useScheduleStore.getState()
            set({ user: currentUser ?? undefined })
            await fetchSchedule(firebaseUser.uid)
          }
          else {
            set({ user: undefined })
            useScheduleStore.getState().clearSchedule()
          }

          set({ loading: false })
        })

        return unsubscribeAuth
      },

      login: async (navigate) => {
        try {
          set({ loading: true, error: null })
          const profile = await loginUser(navigate)

          if (profile) {
            set({ user: { ...profile } })

            const { fetchSchedule } = useScheduleStore.getState()
            await fetchSchedule(profile.uid)
          }
        }
        catch (error) {
          console.error('Error during login:', error)
          set({ error: 'Login failed. Please try again.' })
          toast.error('Login failed. Please try again.')
        }
        finally {
          set({ loading: false })
        }
      },

      logout: async (navigate) => {
        try {
          set({ loading: true, error: null })
          await logoutUser(navigate)

          set({ user: undefined })
          useScheduleStore.getState().clearSchedule()
          toast.success('Logged out successfully.')
        }
        catch (error) {
          console.error('Error during logout:', error)
          set({ error: 'Logout failed. Please try again.' })
          toast.error('Logout failed. Please try again.')
        }
        finally {
          set({ loading: false })
        }
      },

      updateProfile: async (updates) => {
        const currentUser = get().user
        if (!currentUser) {
          console.warn('No user is currently logged in.')
          return
        }

        try {
          await updateDocument(currentUser.uid, 'users', updates)
          set({ user: { ...currentUser, ...updates } })
          toast.success('Profile updated successfully!')
        }
        catch (error) {
          console.error('Error updating profile:', error)
          set({ error: 'Profile update failed. Please try again.' })
          toast.error('Profile update failed. Please try again.')
        }
      },
    }),
    { name: 'user-store' },
  ),
)

export default useUserStore
