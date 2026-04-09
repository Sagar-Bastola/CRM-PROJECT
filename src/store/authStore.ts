import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthResponse } from '../types'

interface AuthState {
  token: string | null
  user: AuthResponse | null
  isAuthenticated: boolean
  login: (data: AuthResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (data) => set({
        token: data.token,
        user: data,
        isAuthenticated: true,
      }),
      logout: () => set({
        token: null,
        user: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'heavytrack-auth',
    }
  )
)