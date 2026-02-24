import { useUserStore } from '@/store/userStore'
import { useThemeStore } from '@/store/themeStore'

/**
 * 统一聚合权限和主题相关的 Hook
 * 将 usePermission 和 useTheme 的能力合并到一个入口
 */
export function useStore() {
  // ===== 权限相关 =====
  const hasPermission = useUserStore((state) => state.hasPermission)
  const userInfo = useUserStore((state) => state.userInfo)

  // ===== 主题相关 =====
  const mode = useThemeStore((state) => state.mode)
  const isDark = mode === 'dark'
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const setTheme = useThemeStore((state) => state.setTheme)

  return {
    // 权限
    hasPermission,
    userInfo,

    // 主题
    mode,
    isDark,
    toggleTheme,
    setTheme,
  }
}
