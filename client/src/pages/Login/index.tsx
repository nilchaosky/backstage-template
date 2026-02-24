import { useState } from 'react'
import { Form, Input, Button, Typography, message, theme, Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons'
import loginBg from '@/assets/login.jpg'
import { login } from '@/api/base'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'
import { trimAllSpaces } from '@/utils'
import { APP_NAME } from '@/constants'

const { Title } = Typography
const { useToken } = theme

interface LoginForm {
  username: string
  password: string
}

function Login() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { token } = useToken()
  const navigate = useNavigate()
  const { setToken } = useAuthStore()
  const { setId } = useUserStore()

  // 处理表单提交
  const handleSubmit = async (values: LoginForm) => {
    try {
      setLoading(true)

      // 调用登录 API（API 层已处理 BaseResponse，直接返回数据）
      const data = await login({
        username: values.username,
        password: values.password,
      })

      // 保存 token 和 refresh token
      setToken(data.token, data.refresh_token)

      // 保存用户 ID
      setId(data.id)

      // 登录成功提示
      message.success('登录成功！')

      // 跳转到首页
      navigate('/dashboard', { replace: true })
    } catch (error) {
      // 错误处理（API 拦截器已经处理了错误并显示提示，这里只需要记录日志）
      console.error('登录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: token.paddingXL,
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: token.borderRadiusLG,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          border: 'none',
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ padding: token.paddingXL * 2 }}>
          {/* 标题区域 */}
          <div style={{ textAlign: 'center', marginBottom: token.marginXXL * 2 }}>
            <Title 
              level={2} 
              style={{ 
                marginBottom: 0,
                fontSize: 24,
                fontWeight: 500,
                color: token.colorText,
              }}
            >
              {APP_NAME}
            </Title>
          </div>

        {/* 登录表单 */}
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="on"
          size="large"
          layout="vertical"
          validateTrigger="onBlur"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            normalize={trimAllSpaces}
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { max: 20, message: '用户名最多20个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
            ]}
            style={{ marginBottom: token.marginLG }}
          >
            <Input
              prefix={<UserOutlined style={{ color: token.colorTextSecondary }} />}
              placeholder="账号/手机"
              autoComplete="username"
              allowClear
              style={{
                height: 48,
                borderRadius: token.borderRadiusLG,
                fontSize: token.fontSizeLG,
              }}
              onPressEnter={() => form.submit()}
            />
          </Form.Item>

          <Form.Item
            name="password"
            normalize={trimAllSpaces}
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
              { max: 20, message: '密码最多20个字符' },
            ]}
            style={{ marginBottom: token.marginXXL }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: token.colorTextSecondary }} />}
              placeholder="请输入密码"
              autoComplete="current-password"
              allowClear
              style={{
                height: 48,
                borderRadius: token.borderRadiusLG,
                fontSize: token.fontSizeLG,
              }}
              onPressEnter={() => form.submit()}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: 48,
                fontSize: token.fontSizeLG,
                fontWeight: 500,
                borderRadius: token.borderRadiusLG,
                background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%)`,
                border: 'none',
                boxShadow: `0 4px 12px ${token.colorPrimary}40`,
              }}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>
        </div>
      </Card>
    </div>
  )
}

export default Login
