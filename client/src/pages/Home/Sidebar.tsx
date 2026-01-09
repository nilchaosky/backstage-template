import { useState } from 'react'
import { Layout, Menu, Tooltip, theme } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, FileTextOutlined, TableOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'

const { Sider } = Layout

type TokenType = ReturnType<typeof theme.useToken>['token']

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
  mode: 'light' | 'dark'
  token: TokenType
}

// 菜单项配置
const menuItems: MenuProps['items'] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'template',
    icon: <FileTextOutlined />,
    label: '模板管理',
    children: [
      {
        key: 'table-template',
        icon: <TableOutlined />,
        label: '表格模板',
      },
    ],
  },
]

function Sidebar({
  collapsed,
  onCollapse,
  mode,
  token,
}: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    // 根据当前路径初始化打开的菜单
    const path = location.pathname
    if (path === '/table-template') return ['template']
    return []
  })

  // 根据当前路径设置选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname
    if (path === '/dashboard' || path === '/') return 'dashboard'
    if (path === '/table-template') return 'table-template'
    return 'dashboard'
  }

  // 处理菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    const routeMap: Record<string, string> = {
      dashboard: '/dashboard',
      'table-template': '/table-template',
    }
    const route = routeMap[key]
    if (route) {
      void Promise.resolve(navigate(route))
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
