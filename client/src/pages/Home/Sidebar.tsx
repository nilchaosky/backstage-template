import { useState, useMemo } from 'react'
import { Layout, Menu, Tooltip, theme } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, SafetyOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { useStore } from '@/hooks'

const { Sider } = Layout

type TokenType = ReturnType<typeof theme.useToken>['token']

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
  mode: 'light' | 'dark'
  token: TokenType
}

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  SafetyOutlined: <SafetyOutlined />,
  UserOutlined: <UserOutlined />,
  TeamOutlined: <TeamOutlined />,
}

// 菜单项类型
interface MenuItemConfig {
  key: string
  label: string
  icon: string
  path: string
  // 可选的权限 code，不配置则为公共菜单
  permission?: string
  children?: MenuItemConfig[]
}

// 静态菜单配置列表
const MENU_CONFIGS: MenuItemConfig[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: 'DashboardOutlined',
    path: '/dashboard',
  },
  {
    key: 'permission',
    label: '权限管理',
    icon: 'SafetyOutlined',
    path: '/permission',
    children: [
      {
        key: 'permission.role',
        label: '角色管理',
        icon: 'TeamOutlined',
        path: '/permission/role',
        permission: 'permission.role',
      },
      {
        key: 'permission.user',
        label: '用户管理',
        icon: 'UserOutlined',
        path: '/permission/user',
        permission: 'permission.user',
      },
    ],
  },
]

// 从菜单配置生成菜单项（不进行权限检查，权限已在配置阶段过滤）
const getMenuItems = (menuConfigs: MenuItemConfig[]): MenuProps['items'] => {
  const items: MenuProps['items'] = []

  menuConfigs.forEach((config) => {
    // 如果有子菜单
    if (config.children && config.children.length > 0) {
      const children: MenuProps['items'] = []

      config.children.forEach((child) => {
        children.push({
          key: child.key,
          label: child.label,
          icon: iconMap[child.icon] || null,
        })
      })

      // 只有当有子菜单时才显示父菜单
      if (children.length > 0) {
        items.push({
          key: config.key,
          label: config.label,
          icon: iconMap[config.icon] || null,
          children,
        })
      }
    } else {
      // 顶级菜单（权限由路由 loader 处理）
      items.push({
        key: config.key,
        label: config.label,
        icon: iconMap[config.icon] || null,
      })
    }
  })

  return items
}

function Sidebar({
  collapsed,
  onCollapse,
  mode,
  token,
}: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { hasPermission } = useStore()

  // 按权限过滤静态菜单配置
  const menuConfigs = useMemo(() => {
    const filterByPermission = (configs: MenuItemConfig[]): MenuItemConfig[] => {
      const result: MenuItemConfig[] = []

      configs.forEach((config) => {
        // 先处理子菜单
        if (config.children && config.children.length > 0) {
          const filteredChildren = filterByPermission(config.children)
          if (filteredChildren.length > 0) {
            result.push({
              ...config,
              children: filteredChildren,
            })
          }
          return
        }

        // 叶子菜单：如果有权限要求，则按权限过滤；否则直接保留
        if (config.permission) {
          if (hasPermission(config.permission)) {
            result.push({ ...config })
          }
        } else {
          result.push({ ...config })
        }
      })

      return result
    }

    return filterByPermission(MENU_CONFIGS)
  }, [hasPermission])

  // 从菜单配置生成菜单项（不进行权限检查）
  const menuItems = useMemo(() => getMenuItems(menuConfigs), [menuConfigs])

  // 构建路由映射（从菜单配置中提取）
  const routeMap = useMemo(() => {
    const map: Record<string, string> = {}
    const buildRouteMap = (configs: MenuItemConfig[]) => {
      configs.forEach((config) => {
        if (config.children) {
          config.children.forEach((child) => {
            map[child.key] = child.path
          })
          buildRouteMap(config.children)
        } else {
          map[config.key] = config.path
        }
      })
    }
    buildRouteMap(menuConfigs)
    return map
  }, [menuConfigs])

  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    // 根据当前路径初始化打开的菜单
    const path = location.pathname
    // 查找父菜单
    for (const config of menuConfigs) {
      if (config.children) {
        const hasChild = config.children.some((child) => path.startsWith(child.path))
        if (hasChild) {
          return [config.key]
        }
      }
    }
    return []
  })

  // 根据当前路径设置选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname
    // 精确匹配优先
    for (const config of menuConfigs) {
      if (config.path === path) {
        return config.key
      }
      if (config.children) {
        for (const child of config.children) {
          if (child.path === path) {
            return child.key
          }
        }
      }
    }
    return 'dashboard'
  }

  // 处理菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    const route = routeMap[key]
    if (route) {
      navigate(route)
    }
  }
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={200}
      collapsedWidth={80}
      theme={mode === 'dark' ? 'dark' : 'light'}
      trigger={
        <Tooltip title={collapsed ? '展开' : undefined} placement="right">
          <div
            style={{
              borderTop: `1px solid ${token.colorBorder}`,
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: token.paddingXS,
              cursor: 'pointer',
              width: '100%',
              zIndex: 10,
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            {!collapsed && <span>收起</span>}
          </div>
        </Tooltip>
      }
      style={{
        position: 'relative',
        height: '100%',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            height: '100%',
            borderRight: 'none',
          }}
        />
      </div>
    </Sider>
  )
}

export default Sidebar
