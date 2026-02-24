import { useState } from 'react'
import { Layout, Typography, theme, Card } from 'antd'
import { Outlet } from 'react-router-dom'
import { useStore } from '@/hooks'
import { APP_NAME } from '@/constants'
import HeaderActions from './HeaderActions'
import Sidebar from './Sidebar'
import BreadcrumbNav from './BreadcrumbNav'

const { Header, Content } = Layout
const { Title } = Typography
const { useToken } = theme

function Home() {
  const [collapsed, setCollapsed] = useState(false)
  const { mode } = useStore()
  const { token } = useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部 Header */}
      <Header 
        style={{ 
          padding: 0,
          backgroundColor: token.colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `0 2px 8px ${token.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            width: collapsed ? 80 : 200,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.2s',
            flexShrink: 0,
          }}
        >
          {!collapsed && (
            <Title level={4} style={{ margin: 0 }}>
              {APP_NAME}
            </Title>
          )}
        </div>
        <HeaderActions />
      </Header>

      <Layout style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        {/* 左侧菜单栏 */}
        <Sidebar
          collapsed={collapsed}
          onCollapse={setCollapsed}
          mode={mode}
          token={token}
        />

        {/* 右侧主要内容区域 */}
        <Layout style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <BreadcrumbNav />
          <Content style={{ flex: 1, padding: `${token.padding}px ${token.padding}px`, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Outlet />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default Home
