import { create } from 'zustand'

interface UserInfo {
  id?: number | string
  username?: string
  [key: string]: unknown
}

interface UserState {
  userInfo: UserInfo | null
  setUserInfo: (info: UserInfo) => void
  clearUserInfo: () => void
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (info) => {
    set({ userInfo: info })
  },
  clearUserInfo: () => {
    set({ userInfo: null })
  },
}))
