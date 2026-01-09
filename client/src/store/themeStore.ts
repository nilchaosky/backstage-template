import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
  getThemeConfig: () => ThemeConfig
}

// 亮色主题配置
const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
  },
  algorithm: theme.defaultAlgorithm,
}

// 暗色主题配置
const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
  },
  algorithm: theme.darkAlgorithm,
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light', // 默认亮色主题
      toggleTheme: () => {
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        }))
      },
      setTheme: (mode) => {
        set({ mode })
      },
      getThemeConfig: () => {
        const { mode } = get()
        return mode === 'dark' ? darkTheme : lightTheme
      },
    }),
    {
      name: 'theme-storage', // localStorage key
      partialize: (state) => ({ mode: state.mode }),
      merge: (persistedState, currentState) => {
        // 确保返回的状态有 mode 字段，默认为 'light'
        return {
          ...currentState,
          mode: (persistedState as { mode?: ThemeMode })?.mode ?? 'light',
        }
      },
    }
  )
)
