import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { APP_NAME } from '@/constants'

// 代码分割：使用 lazy loading
const Login = lazy(() => import('../pages/Login'))
const Home = lazy(() => import('../pages/Home'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const TableTemplate = lazy(() => import('../pages/TableTemplate'))

// 加载中组件
const Loading = () => <div>加载中...</div>

// 路由配置类型
export interface RouteConfig {
  path: string
  element: React.ReactNode
  breadcrumb?: string | string[]
  children?: RouteConfig[]
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    ),
    handle: {
      breadcrumb: APP_NAME,
    },
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
        handle: {
          breadcrumb: '仪表盘',
        },
      },
      {
        path: '/table-template',
        element: (
          <Suspense fallback={<Loading />}>
            <TableTemplate />
          </Suspense>
        ),
        handle: {
          breadcrumb: ['模板管理', '表格模板'],
        },
      },
    ],
  },
])

export default router
