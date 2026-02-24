import { Suspense, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, Spin, App as AntdApp, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useThemeStore } from './store/themeStore'
import ErrorBoundary from './components/ErrorBoundary'
import { router } from './router'

const { useToken } = theme

// 内部组件：用于在 ConfigProvider 内部获取主题 token 并更新 CSS 变量
function ThemeVariableUpdater() {
  const { token } = useToken()

  useEffect(() => {
    const root = document.documentElement
    // 使用主题的容器背景色
    root.style.setProperty('--tr-panel-bg', token.colorBgContainer)
  }, [token.colorBgContainer])

  return null
}

function AppContent() {
  const themeConfig = useThemeStore((state) => state.getThemeConfig())

  return (
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <AntdApp>
        <ThemeVariableUpdater />
        <Suspense
          fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin size="large" />
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </AntdApp>
    </ConfigProvider>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}

export default App
