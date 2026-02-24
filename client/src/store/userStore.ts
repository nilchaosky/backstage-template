import { create } from 'zustand'
import type { User } from '@/types/response'

interface UserState {
  id: string | null
  userInfo: User | null
  setId: (id: string) => void
  setUserInfo: (info: User) => void
  clearUserInfo: () => void
  hasPermission: (permission: string) => boolean
}

export const useUserStore = create<UserState>((set, get) => ({
  id: null,
  userInfo: null,
  setId: (id) => {
    set({ id })
  },
  setUserInfo: (info) => {
    set({ userInfo: info })
  },
  clearUserInfo: () => {
    set({ userInfo: null, id: null })
  },
  hasPermission: (permission: string) => {
    const { userInfo } = get()
    if (!userInfo || !userInfo.permission || userInfo.permission.length === 0) {
      return false
    }

    // 仅进行全等匹配，不再做前缀 / 层级权限推导
    return userInfo.permission.includes(permission)
  },
}))
