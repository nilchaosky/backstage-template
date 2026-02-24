import { useState } from 'react'
import { Button, Avatar, Dropdown, Space, message, Typography, theme } from 'antd'
import { UserOutlined, BellOutlined, SunOutlined, MoonOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/hooks'
import { logout } from '@/api/base'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'
import ChangePassword from './ChangePassword'

const { Text } = Typography
const { useToken } = theme

function HeaderActions() {
  const { mode, toggleTheme } = useStore()
  const navigate = useNavigate()
  const { clearToken } = useAuthStore()
  const { clearUserInfo, userInfo } = useUserStore()
  const { token } = useToken()
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'changePassword',
      icon: <LockOutlined />,
      label: '修改密码',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]

  const handleUserMenuClick = async ({ key }: { key: string }) => {
    if (key === 'logout') {
      try {
        // 调用退出登录 API
        await logout()
        // 清除 token 和用户信息
        clearToken()
        clearUserInfo()
        // 显示成功提示
        message.success('退出登录成功')
        // 跳转到登录页
        navigate('/login', { replace: true })
      } catch {
        // 即使 API 调用失败，也清除本地状态并跳转
        clearToken()
        clearUserInfo()
        navigate('/login', { replace: true })
      }
    } else if (key === 'changePassword') {
      setChangePasswordOpen(true)
    }
  }
  return (
    <>
      <Space size="middle" style={{ paddingRight: token.paddingLG }}>
        <Button
          type="text"
          icon={mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
          onClick={toggleTheme}
          title={mode === 'light' ? '切换到暗色主题' : '切换到亮色主题'}
        />
        <Button type="text" icon={<BellOutlined />} />
        <Dropdown menu={{ items: userMenuItems, onClick: (e) => {
          void handleUserMenuClick(e)
        } }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <Text strong style={{ fontSize: token.fontSizeLG }}>{userInfo?.username ?? '用户'}</Text>
          </Space>
        </Dropdown>
      </Space>
      <ChangePassword open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </>
  )
}

export default HeaderActions
