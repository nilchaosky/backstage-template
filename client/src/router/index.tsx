import { lazy } from 'react'
import { createBrowserRouter, redirect, Navigate } from 'react-router-dom'
import type { RouteObject, LoaderFunctionArgs } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'
import { getCurrentUser } from '@/api/user'

// 代码分割：使用 lazy loading
const Login = lazy(() => import('../pages/Login'))
const Home = lazy(() => import('../pages/Home'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const RoleManagement = lazy(() => import('../pages/Role'))
const UserManagement = lazy(() => import('../pages/User'))

/**
 * 权限检查 loader
 * - 检查是否登录（token）
 * - 如果 userInfo 不存在，先获取用户信息
 * - 检查是否有指定权限
 * - 未登录或无权限时重定向到登录页
 */
const permissionLoader = (requiredPermission?: string) => {
  return async ({ request }: LoaderFunctionArgs) => {
    const { token } = useAuthStore.getState()
    let { userInfo, hasPermission, setUserInfo } = useUserStore.getState()

    // 未登录，重定向到登录页
    if (!token) {
      const url = new URL(request.url)
      return redirect(`/login?redirect=${encodeURIComponent(url.pathname)}`)
    }

    // userInfo 应该在父路由 loader 中已经加载，这里只需要检查
    // 如果不存在（理论上不应该发生），说明父路由 loader 执行失败
    if (!userInfo) {
      try {
        const user = await getCurrentUser()
        setUserInfo(user)
        userInfo = user
      } catch (error) {
        return redirect('/login')
      }
    }

    // 如果指定了权限要求，检查权限
    if (requiredPermission) {
      const hasPerm = hasPermission(requiredPermission)
      
      if (!hasPerm) {
        // 无权限，重定向到登录页（或可改为 403 页面）
        return redirect('/login')
      }
    }

    return null
  }
}


// 路由配置
const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Home />,
    loader: async () => {
      const { token } = useAuthStore.getState()
      if (!token) {
        return redirect('/login')
      }

      // 确保用户信息已加载（如果不存在则获取）
      const { userInfo, setUserInfo } = useUserStore.getState()
      if (!userInfo) {
        try {
          const user = await getCurrentUser()
          setUserInfo(user)
        } catch (error) {
          // 获取失败可能是 token 过期，重定向到登录页
          return redirect('/login')
        }
      }

      return null
    },
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
        handle: {
          breadcrumb: '仪表盘',
        },
      },
      {
        path: 'permission',
        children: [
          {
            path: 'role',
            element: <RoleManagement />,
            loader: permissionLoader('permission.role'),
            handle: {
              breadcrumb: ['权限管理', '角色管理'],
            },
          },
          {
            path: 'user',
            element: <UserManagement />,
            loader: permissionLoader('permission.user'),
            handle: {
              breadcrumb: ['权限管理', '用户管理'],
            },
          },
        ],
      },
    ],
  },
]

// 创建路由实例
export const router = createBrowserRouter(routes)

