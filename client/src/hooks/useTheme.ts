import { useThemeStore } from '@/store/themeStore'

/**
 * 主题自定义 Hook
 * 封装主题状态和操作
 */
export function useTheme() {
  const mode = useThemeStore((state) => state.mode)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const isDark = mode === 'dark'

  return {
    mode,
    isDark,
    toggleTheme,
    setTheme,
  }
}
